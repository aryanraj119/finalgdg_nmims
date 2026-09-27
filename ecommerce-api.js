/**
 * IKEA & SPYLT Full E-Commerce Client API Client
 * Connects Frontend to FastAPI Backend (DB, Auth, Cart, Payments)
 */
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api';

class EcommerceAPI {
  constructor() {
    this.token = localStorage.getItem('ikea_auth_token');
    this.guestSessionId = this.getOrCreateGuestSession();
    this.currentUser = JSON.parse(localStorage.getItem('ikea_user') || 'null');
    this.cartListeners = [];
    this.authListeners = [];
  }

  getOrCreateGuestSession() {
    let sess = localStorage.getItem('ikea_guest_session_id');
    if (!sess) {
      sess = 'guest_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
      localStorage.setItem('ikea_guest_session_id', sess);
    }
    return sess;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'x-guest-session-id': this.guestSessionId
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = { ...this.getHeaders(), ...(options.headers || {}) };
    
    try {
      const res = await fetch(url, { ...options, headers });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || `Request failed with status ${res.status}`);
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  }

  // ================= AUTH =================
  async register({ email, password, full_name, phone }) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name, phone })
    });
    this.setSession(data.access_token, data.user);
    await this.mergeGuestCart();
    return data.user;
  }

  async login({ email, password }) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setSession(data.access_token, data.user);
    await this.mergeGuestCart();
    return data.user;
  }

  async getCurrentUser() {
    if (!this.token) return null;
    try {
      const user = await this.request('/auth/me');
      this.currentUser = user;
      localStorage.setItem('ikea_user', JSON.stringify(user));
      this.notifyAuthListeners();
      return user;
    } catch (e) {
      this.logout();
      return null;
    }
  }

  logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('ikea_auth_token');
    localStorage.removeItem('ikea_user');
    this.notifyAuthListeners();
    this.getCart(); // Reload guest cart
  }

  setSession(token, user) {
    this.token = token;
    this.currentUser = user;
    localStorage.setItem('ikea_auth_token', token);
    localStorage.setItem('ikea_user', JSON.stringify(user));
    this.notifyAuthListeners();
  }

  async forgotPassword(email) {
    return await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(token, new_password) {
    return await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password })
    });
  }

  // ================= CART =================
  async getCart() {
    try {
      const cart = await this.request('/cart');
      this.notifyCartListeners(cart);
      return cart;
    } catch (e) {
      return { items: [], total_quantity: 0, total_amount: 0.0 };
    }
  }

  async addToCart(productId, quantity = 1, selectedColor = null) {
    const cart = await this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity: Number(quantity),
        selected_color: selectedColor
      })
    });
    this.notifyCartListeners(cart);
    return cart;
  }

  async updateCartItem(itemId, quantity, selectedColor = null) {
    const cart = await this.request(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({
        quantity: Number(quantity),
        selected_color: selectedColor
      })
    });
    this.notifyCartListeners(cart);
    return cart;
  }

  async removeCartItem(itemId) {
    const cart = await this.request(`/cart/items/${itemId}`, {
      method: 'DELETE'
    });
    this.notifyCartListeners(cart);
    return cart;
  }

  async clearCart() {
    const cart = await this.request('/cart/clear', {
      method: 'POST'
    });
    this.notifyCartListeners(cart);
    return cart;
  }

  async mergeGuestCart() {
    try {
      if (this.guestSessionId) {
        await this.request('/cart/merge', {
          method: 'POST',
          body: JSON.stringify({ guest_session_id: this.guestSessionId })
        });
        await this.getCart();
      }
    } catch (e) {
      console.warn('Cart merge skipped:', e.message);
    }
  }

  // ================= PAYMENTS & CHECKOUT =================
  async getDeliveryOptions(pincode) {
    return await this.request(`/payments/delivery-options?pincode=${encodeURIComponent(pincode)}`);
  }

  async createOrder({ customer_name, customer_email, customer_phone, shipping_address, city, pincode, state = "Maharashtra", delivery_method = "delivery", pickup_store = null, discount_code = null, items = null, notes = null }) {
    return await this.request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        city,
        state,
        pincode,
        delivery_method,
        pickup_store,
        discount_code,
        items,
        guest_session_id: this.guestSessionId,
        notes
      })
    });
  }

  async verifyPayment({ order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const order = await this.request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({
        order_id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      })
    });
    await this.getCart(); // Cart cleared on server
    return order;
  }

  async getOrder(orderId) {
    return await this.request(`/payments/orders/${orderId}`);
  }

  async getUserOrders() {
    return await this.request('/payments/orders');
  }

  // ================= LISTENERS =================
  onCartChange(callback) {
    this.cartListeners.push(callback);
    this.getCart().then(callback);
  }

  notifyCartListeners(cart) {
    this.cartListeners.forEach(cb => cb(cart));
  }

  onAuthChange(callback) {
    this.authListeners.push(callback);
    callback(this.currentUser);
  }

  notifyAuthListeners() {
    this.authListeners.forEach(cb => cb(this.currentUser));
  }
}

window.ecommerceAPI = new EcommerceAPI();
