// ==========================================================================
// IKEA INDIA STOREFRONT - INTERACTION & STATE LOGIC
// Compliant with DESIGN.md & SKILL.md token behaviors and accessibility
// ==========================================================================

// Global Application State
const AppState = {
  cart: JSON.parse(localStorage.getItem('ikea_cart')) || [
    { productId: "ikea-001", quantity: 1 },
    { productId: "ikea-012", quantity: 2 }
  ],
  wishlist: JSON.parse(localStorage.getItem('ikea_wishlist')) || ["ikea-002", "ikea-007"],
  activeCategory: "all",
  activeSearchQuery: "",
  maxPrice: 50000,
  filterIkeaFamilyOnly: false,
  filterBestsellersOnly: false,
  filterInStockOnly: true,
  currentSort: "featured",
  currentPincode: "Mumbai 400001",
  heroCurrentSlide: 0
};

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initCategoryFilters();
  initSearchAutocomplete();
  initSidebarFilters();
  initHotspots();
  renderProducts();
  updateCartBadge();
  updateWishlistBadge();
  renderCartDrawer();
  renderWishlistDrawer();
  initKeyboardA11y();
});

// ==========================================================================
// HERO SLIDER LOGIC
// ==========================================================================
function initHeroSlider() {
  const track = document.getElementById('hero-slider-track');
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');
  const dots = document.querySelectorAll('.hero-dot');
  
  if (!track || slides.length === 0) return;

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    AppState.heroCurrentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(AppState.heroCurrentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(AppState.heroCurrentSlide + 1));
  
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.dataset.slide, 10);
      goToSlide(slideIndex);
    });
  });

  // Auto advance every 6 seconds
  setInterval(() => {
    goToSlide(AppState.heroCurrentSlide + 1);
  }, 6000);
}

// ==========================================================================
// CATEGORY FILTERING & NAVIGATION
// ==========================================================================
function initCategoryFilters() {
  // Category Pills
  const pills = document.querySelectorAll('.category-filter-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pills.forEach(p => p.classList.remove('active'));
      const btn = e.currentTarget;
      btn.classList.add('active');
      AppState.activeCategory = btn.dataset.category;
      syncSubnavCategory(AppState.activeCategory);
      renderProducts();
    });
  });

  // Category Subnav links
  const navLinks = document.querySelectorAll('.nav-item-link[data-nav-category]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.dataset.navCategory;
      AppState.activeCategory = cat;
      syncPillCategory(cat);
      syncSubnavCategory(cat);
      renderProducts();
      
      const catalogEl = document.getElementById('products-catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function syncPillCategory(category) {
  const pills = document.querySelectorAll('.category-filter-btn');
  pills.forEach(p => {
    p.classList.toggle('active', p.dataset.category === category);
  });
}

function syncSubnavCategory(category) {
  const navLinks = document.querySelectorAll('.nav-item-link[data-nav-category]');
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.navCategory === category);
  });
}

// ==========================================================================
// SEARCH & AUTOCOMPLETE
// ==========================================================================
function initSearchAutocomplete() {
  const searchInput = document.getElementById('site-search-input');
  const searchDropdown = document.getElementById('search-autocomplete-dropdown');
  const searchClearBtn = document.getElementById('search-clear-btn');

  if (!searchInput || !searchDropdown) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    AppState.activeSearchQuery = query;
    
    if (searchClearBtn) {
      searchClearBtn.classList.toggle('active', query.length > 0);
    }

    if (query.length < 2) {
      searchDropdown.classList.remove('open');
      searchDropdown.innerHTML = '';
      renderProducts();
      return;
    }

    const matches = PRODUCTS_DATA.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );

    if (matches.length > 0) {
      let html = `<div class="dropdown-section-title">Matching IKEA Products (${matches.length})</div>`;
      matches.slice(0, 5).forEach(prod => {
        html += `
          <div class="search-result-item" onclick="openQuickView('${prod.id}'); document.getElementById('search-autocomplete-dropdown').classList.remove('open');">
            <img src="${prod.image}" alt="${prod.name}">
            <div class="search-result-info">
              <h4><strong>${prod.name}</strong> - ${prod.type}</h4>
              <p>₹${prod.price.toLocaleString('en-IN')} • ${prod.category}</p>
            </div>
          </div>
        `;
      });
      searchDropdown.innerHTML = html;
      searchDropdown.classList.add('open');
    } else {
      searchDropdown.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--color-text-muted); font-size: 13px;">
          No matching furniture or decor found for "<strong>${escapeHtml(query)}</strong>"
        </div>
      `;
      searchDropdown.classList.add('open');
    }

    renderProducts();
  });

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      AppState.activeSearchQuery = '';
      searchClearBtn.classList.remove('active');
      searchDropdown.classList.remove('open');
      searchDropdown.innerHTML = '';
      renderProducts();
    });
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      searchDropdown.classList.remove('open');
    }
  });
}

// ==========================================================================
// SIDEBAR FILTERS & SORTING
// ==========================================================================
function initSidebarFilters() {
  const priceSlider = document.getElementById('price-range-input');
  const priceDisplay = document.getElementById('price-max-display');
  const ikeaFamilyCheck = document.getElementById('filter-ikea-family');
  const bestsellerCheck = document.getElementById('filter-bestseller');
  const resetBtn = document.getElementById('reset-filters-btn');
  const sortSelect = document.getElementById('sort-dropdown');

  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      AppState.maxPrice = parseInt(e.target.value, 10);
      if (priceDisplay) {
        priceDisplay.textContent = `Up to ₹${AppState.maxPrice.toLocaleString('en-IN')}`;
      }
      renderProducts();
    });
  }

  if (ikeaFamilyCheck) {
    ikeaFamilyCheck.addEventListener('change', (e) => {
      AppState.filterIkeaFamilyOnly = e.target.checked;
      renderProducts();
    });
  }

  if (bestsellerCheck) {
    bestsellerCheck.addEventListener('change', (e) => {
      AppState.filterBestsellersOnly = e.target.checked;
      renderProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.currentSort = e.target.value;
      renderProducts();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      AppState.activeCategory = "all";
      AppState.activeSearchQuery = "";
      AppState.maxPrice = 50000;
      AppState.filterIkeaFamilyOnly = false;
      AppState.filterBestsellersOnly = false;
      AppState.currentSort = "featured";

      if (priceSlider) priceSlider.value = 50000;
      if (priceDisplay) priceDisplay.textContent = "Up to ₹50,000";
      if (ikeaFamilyCheck) ikeaFamilyCheck.checked = false;
      if (bestsellerCheck) bestsellerCheck.checked = false;
      if (sortSelect) sortSelect.value = "featured";

      const searchInput = document.getElementById('site-search-input');
      if (searchInput) searchInput.value = '';

      syncPillCategory("all");
      syncSubnavCategory("all");
      renderProducts();
      showToast("Filters reset to default", "info");
    });
  }
}

// ==========================================================================
// PRODUCT RENDERING ENGINE
// ==========================================================================
function renderProducts() {
  const grid = document.getElementById('products-grid');
  const countDisplay = document.getElementById('products-count-num');
  if (!grid) return;

  // Filter products
  let filtered = PRODUCTS_DATA.filter(prod => {
    // Category check
    if (AppState.activeCategory !== "all" && prod.category !== AppState.activeCategory) {
      return false;
    }
    // Search query check
    if (AppState.activeSearchQuery) {
      const q = AppState.activeSearchQuery.toLowerCase();
      const match = prod.name.toLowerCase().includes(q) ||
                    prod.category.toLowerCase().includes(q) ||
                    prod.type.toLowerCase().includes(q) ||
                    prod.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    // Price range
    if (prod.price > AppState.maxPrice) {
      return false;
    }
    // IKEA Family
    if (AppState.filterIkeaFamilyOnly && !prod.isIkeaFamily) {
      return false;
    }
    // Bestsellers
    if (AppState.filterBestsellersOnly && !prod.isBestseller) {
      return false;
    }
    return true;
  });

  // Sort products
  if (AppState.currentSort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (AppState.currentSort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (AppState.currentSort === "rating-desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (AppState.currentSort === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (countDisplay) {
    countDisplay.textContent = filtered.length;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background: var(--color-surface-muted); border-radius: var(--radius-box-lg);">
        <h3 style="font-size: 20px; margin-bottom: 8px; color: var(--color-text-secondary);">No products match your active filters</h3>
        <p style="font-size: 14px; color: var(--color-text-muted); margin-bottom: 20px;">Try adjusting your price range or resetting the category filter.</p>
        <button class="btn-ikea-primary" onclick="document.getElementById('reset-filters-btn').click()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(prod => {
    const isWishlisted = AppState.wishlist.includes(prod.id);
    const hasDiscount = prod.originalPrice && prod.originalPrice > prod.price;
    const isFamily = prod.isIkeaFamily && prod.ikeaFamilyPrice;

    return `
      <article class="product-card" data-id="${prod.id}">
        <div class="product-card-media">
          <img src="${prod.image}" alt="${prod.name} ${prod.type}" class="product-card-img" loading="lazy" />
          
          ${prod.badge ? `<span class="card-badge ${prod.isBestseller ? 'bestseller' : ''}">${prod.badge}</span>` : ''}

          <button class="wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${prod.id}', event)" aria-label="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}" title="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? '#e00751' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>

          <button class="quick-view-overlay-btn" onclick="openQuickView('${prod.id}')">
            Quick View Specs
          </button>
        </div>

        <div class="product-card-body">
          <div class="product-meta-row">
            <span class="product-category-sub">${prod.category}</span>
            <div class="rating-badge" title="${prod.rating} out of 5 stars (${prod.reviewsCount} reviews)">
              <span class="star-icon">★</span>
              <span>${prod.rating}</span>
              <span style="color: var(--color-text-muted); font-size: 11px;">(${prod.reviewsCount})</span>
            </div>
          </div>

          <h3 class="product-title">${prod.name}</h3>
          <p class="product-type-desc">${prod.type} • ${prod.dimensions}</p>

          <div class="product-price-section">
            <div class="price-main">
              <span>₹${prod.price.toLocaleString('en-IN')}</span>
              ${hasDiscount ? `<span class="price-original">₹${prod.originalPrice.toLocaleString('en-IN')}</span>` : ''}
            </div>

            ${isFamily ? `
              <div class="ikea-family-deal-tag">
                <span>Family Price: <strong>₹${prod.ikeaFamilyPrice.toLocaleString('en-IN')}</strong></span>
              </div>
            ` : ''}
          </div>

          <div class="card-action-footer">
            <button class="btn-card-add" id="btn-add-${prod.id}" onclick="addToCart('${prod.id}', 1)" aria-label="Add ${prod.name} to shopping bag">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span>Add to bag</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ==========================================================================
// ROOM HOTSPOTS LOGIC
// ==========================================================================
function initHotspots() {
  const pins = document.querySelectorAll('.hotspot-pin');
  const popover = document.getElementById('hotspot-popover');
  const titleEl = document.getElementById('hotspot-title');
  const priceEl = document.getElementById('hotspot-price');
  const quickAddBtn = document.getElementById('hotspot-quickadd-btn');

  if (!popover) return;

  pins.forEach(pin => {
    pin.addEventListener('mouseenter', (e) => {
      showHotspotPopover(pin);
    });

    pin.addEventListener('click', (e) => {
      showHotspotPopover(pin);
    });
  });

  function showHotspotPopover(pin) {
    const prodId = pin.dataset.productId;
    const prod = PRODUCTS_DATA.find(p => p.id === prodId);
    if (!prod) return;

    titleEl.textContent = `${prod.name} ${prod.type}`;
    priceEl.textContent = `₹${prod.price.toLocaleString('en-IN')}`;
    
    // Position popover relative to container
    const container = document.getElementById('room-hotspot-container');
    const containerRect = container.getBoundingClientRect();
    const pinRect = pin.getBoundingClientRect();

    const topOffset = pinRect.top - containerRect.top + 36;
    const leftOffset = pinRect.left - containerRect.left - 40;

    popover.style.top = `${topOffset}px`;
    popover.style.left = `${Math.max(10, Math.min(containerRect.width - 200, leftOffset))}px`;
    popover.classList.add('visible');

    quickAddBtn.onclick = () => {
      addToCart(prod.id, 1);
      popover.classList.remove('visible');
    };
  }

  // Close popover when clicked outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.room-hotspot-container')) {
      popover.classList.remove('visible');
    }
  });
}

// ==========================================================================
// CART OPERATIONS & DRAWER
// ==========================================================================
function addToCart(productId, quantity = 1) {
  const prod = PRODUCTS_DATA.find(p => p.id === productId);
  if (!prod) return;

  const existing = AppState.cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    AppState.cart.push({ productId, quantity });
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();
  showToast(`Added "${prod.name}" to your shopping bag!`, "success");

  // Visual feedback on card button
  const btn = document.getElementById(`btn-add-${productId}`);
  if (btn) {
    const originalHtml = btn.innerHTML;
    btn.classList.add('added-state');
    btn.innerHTML = `<span>✓ Added</span>`;
    setTimeout(() => {
      btn.classList.remove('added-state');
      btn.innerHTML = originalHtml;
    }, 1500);
  }
}

function updateCartQuantity(productId, delta) {
  const item = AppState.cart.find(i => i.productId === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function removeFromCart(productId) {
  const prod = PRODUCTS_DATA.find(p => p.id === productId);
  AppState.cart = AppState.cart.filter(i => i.productId !== productId);
  saveCart();
  updateCartBadge();
  renderCartDrawer();
  if (prod) {
    showToast(`Removed "${prod.name}" from shopping bag`, "info");
  }
}

function saveCart() {
  localStorage.setItem('ikea_cart', JSON.stringify(AppState.cart));
}

function updateCartBadge() {
  const count = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-badge-count');
  const drawerCount = document.getElementById('cart-items-count-display');
  if (badge) badge.textContent = count;
  if (drawerCount) drawerCount.textContent = count;
}

function renderCartDrawer() {
  const list = document.getElementById('cart-items-container');
  const emptyMsg = document.getElementById('cart-empty-message');
  const footerSummary = document.getElementById('cart-footer-summary');
  const subtotalEl = document.getElementById('cart-subtotal-price');
  const totalEl = document.getElementById('cart-total-price');

  if (!list) return;

  if (AppState.cart.length === 0) {
    list.innerHTML = '';
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (footerSummary) footerSummary.style.display = 'none';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';
  if (footerSummary) footerSummary.style.display = 'block';

  let subtotal = 0;

  list.innerHTML = AppState.cart.map(item => {
    const prod = PRODUCTS_DATA.find(p => p.id === item.productId);
    if (!prod) return '';

    const lineTotal = prod.price * item.quantity;
    subtotal += lineTotal;

    return `
      <li class="cart-item-card">
        <img src="${prod.image}" alt="${prod.name}" class="cart-item-thumb">
        <div class="cart-item-info">
          <div class="cart-item-title">${prod.name} - ${prod.type}</div>
          <div class="cart-item-price">₹${prod.price.toLocaleString('en-IN')}</div>
          
          <div class="cart-qty-stepper">
            <button class="cart-qty-btn" onclick="updateCartQuantity('${prod.id}', -1)" aria-label="Decrease quantity">-</button>
            <span class="cart-qty-value">${item.quantity}</span>
            <button class="cart-qty-btn" onclick="updateCartQuantity('${prod.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove-btn" onclick="removeFromCart('${prod.id}')" aria-label="Remove ${prod.name}">✕</button>
      </li>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
}

// ==========================================================================
// WISHLIST OPERATIONS & DRAWER
// ==========================================================================
function toggleWishlist(productId, event) {
  if (event) event.stopPropagation();

  const prod = PRODUCTS_DATA.find(p => p.id === productId);
  if (!prod) return;

  const idx = AppState.wishlist.indexOf(productId);
  if (idx > -1) {
    AppState.wishlist.splice(idx, 1);
    showToast(`Removed "${prod.name}" from wishlist`, "info");
  } else {
    AppState.wishlist.push(productId);
    showToast(`Saved "${prod.name}" to your wishlist!`, "success");
  }

  localStorage.setItem('ikea_wishlist', JSON.stringify(AppState.wishlist));
  updateWishlistBadge();
  renderWishlistDrawer();
  renderProducts();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge-count');
  const drawerCount = document.getElementById('wishlist-items-count-display');
  const count = AppState.wishlist.length;
  if (badge) badge.textContent = count;
  if (drawerCount) drawerCount.textContent = count;
}

function renderWishlistDrawer() {
  const list = document.getElementById('wishlist-items-container');
  const emptyMsg = document.getElementById('wishlist-empty-message');
  if (!list) return;

  if (AppState.wishlist.length === 0) {
    list.innerHTML = '';
    if (emptyMsg) emptyMsg.style.display = 'block';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';

  list.innerHTML = AppState.wishlist.map(id => {
    const prod = PRODUCTS_DATA.find(p => p.id === id);
    if (!prod) return '';

    return `
      <li class="cart-item-card">
        <img src="${prod.image}" alt="${prod.name}" class="cart-item-thumb">
        <div class="cart-item-info">
          <div class="cart-item-title">${prod.name}</div>
          <p style="font-size: 12px; color: var(--color-text-muted);">${prod.type}</p>
          <div class="cart-item-price">₹${prod.price.toLocaleString('en-IN')}</div>
          
          <button class="btn-ikea-primary" style="padding: 6px 14px; font-size: 12px; margin-top: 4px;" onclick="addToCart('${prod.id}', 1)">
            Move to Bag
          </button>
        </div>
        <button class="cart-item-remove-btn" onclick="toggleWishlist('${prod.id}')" aria-label="Remove ${prod.name}">✕</button>
      </li>
    `;
  }).join('');
}

// ==========================================================================
// QUICK VIEW MODAL
// ==========================================================================
function openQuickView(productId) {
  const prod = PRODUCTS_DATA.find(p => p.id === productId);
  if (!prod) return;

  const modal = document.getElementById('quickview-modal');
  const content = document.getElementById('quickview-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="quickview-media">
      <img src="${prod.image}" alt="${prod.name} ${prod.type}">
    </div>
    <div class="quickview-details">
      <span class="product-category-sub">${prod.category} • ${prod.subCategory}</span>
      <h2 style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-black); margin: 4px 0;">${prod.name}</h2>
      <p style="font-size: var(--font-size-sm); color: var(--color-text-primary); margin-bottom: 12px;">${prod.type}</p>
      
      <div class="price-main" style="margin-bottom: 16px;">
        <span style="font-size: var(--font-size-3xl);">₹${prod.price.toLocaleString('en-IN')}</span>
        ${prod.originalPrice ? `<span class="price-original">₹${prod.originalPrice.toLocaleString('en-IN')}</span>` : ''}
      </div>

      <p style="font-size: var(--font-size-xs); line-height: 1.5; color: var(--color-text-primary); margin-bottom: 16px;">
        ${prod.description}
      </p>

      <div class="spec-list">
        <div class="spec-item"><span class="spec-label">Dimensions:</span><span>${prod.dimensions}</span></div>
        <div class="spec-item"><span class="spec-label">Materials:</span><span>${prod.material}</span></div>
        <div class="spec-item"><span class="spec-label">Colour:</span><span>${prod.selectedColor}</span></div>
        <div class="spec-item"><span class="spec-label">Stock:</span><span style="color: var(--color-success); font-weight: bold;">● ${prod.stockStatus} in ${prod.stores.join(', ')}</span></div>
      </div>

      <div style="display: flex; gap: 12px; margin-top: auto; padding-top: 16px;">
        <button class="btn-ikea-yellow" style="flex: 1;" onclick="addToCart('${prod.id}', 1); closeQuickViewModal();">
          Add to Bag • ₹${prod.price.toLocaleString('en-IN')}
        </button>
        <button class="btn-ikea-secondary" onclick="toggleWishlist('${prod.id}'); closeQuickViewModal();">
          ♥ Wishlist
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuickViewModal() {
  const modal = document.getElementById('quickview-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ==========================================================================
// PINCODE SELECTOR & CHECKOUT DEMO
// ==========================================================================
function initPincodeModal() {
  const trigger = document.getElementById('pincode-trigger-btn');
  const modal = document.getElementById('pincode-modal');
  if (trigger && modal) {
    trigger.addEventListener('click', () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      const input = document.getElementById('pincode-input');
      if (input) input.focus();
    });
  }
}

function closePincodeModal() {
  const modal = document.getElementById('pincode-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function handlePincodeSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('pincode-input');
  if (input && input.value.trim().length === 6) {
    const pin = input.value.trim();
    AppState.currentPincode = `Pincode ${pin}`;
    const display = document.getElementById('current-pincode-text');
    if (display) display.textContent = `India ${pin}`;
    closePincodeModal();
    showToast(`Delivery location updated to ${pin}`, "success");
  }
}

function handleCheckout() {
  if (AppState.cart.length === 0) {
    showToast("Your shopping bag is empty", "info");
    return;
  }
  const total = AppState.cart.reduce((sum, item) => {
    const prod = PRODUCTS_DATA.find(p => p.id === item.productId);
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);

  closeCartDrawer();
  showToast(`Proceeding to Secure Checkout: ₹${total.toLocaleString('en-IN')} (Free Delivery Applied)`, "success");
}

// ==========================================================================
// DRAWER TOGGLES & BACKDROP
// ==========================================================================
document.getElementById('cart-drawer-trigger')?.addEventListener('click', openCartDrawer);
document.getElementById('wishlist-drawer-trigger')?.addEventListener('click', openWishlistDrawer);
document.getElementById('account-btn')?.addEventListener('click', () => {
  showToast("Hej! Welcome to IKEA India Family Portal.", "info");
});

function openCartDrawer() {
  closeAllDrawers();
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('drawer-backdrop')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('drawer-backdrop')?.classList.remove('active');
  document.body.style.overflow = '';
}

function openWishlistDrawer() {
  closeAllDrawers();
  document.getElementById('wishlist-drawer')?.classList.add('open');
  document.getElementById('drawer-backdrop')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeWishlistDrawer() {
  document.getElementById('wishlist-drawer')?.classList.remove('open');
  document.getElementById('drawer-backdrop')?.classList.remove('active');
  document.body.style.overflow = '';
}

function openTokenDrawer() {
  closeAllDrawers();
  document.getElementById('token-drawer')?.classList.add('open');
  document.getElementById('drawer-backdrop')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeTokenDrawer() {
  document.getElementById('token-drawer')?.classList.remove('open');
  document.getElementById('drawer-backdrop')?.classList.remove('active');
  document.body.style.overflow = '';
}

function closeAllDrawers() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('wishlist-drawer')?.classList.remove('open');
  document.getElementById('token-drawer')?.classList.remove('open');
  document.getElementById('drawer-backdrop')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message, type = "info") {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : 'ℹ'}</span>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

// ==========================================================================
// ACCESSIBILITY & KEYBOARD HANDLERS
// ==========================================================================
function initKeyboardA11y() {
  initPincodeModal();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDrawers();
      closeQuickViewModal();
      closePincodeModal();
      const searchDropdown = document.getElementById('search-autocomplete-dropdown');
      if (searchDropdown) searchDropdown.classList.remove('open');
    }
  });

  // Close modals on overlay backdrop click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeQuickViewModal();
        closePincodeModal();
      }
    });
  });
}

function escapeHtml(string) {
  return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
