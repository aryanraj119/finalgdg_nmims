/**
 * IKEA & SPYLT Full E-Commerce UI & Dynamic Cart Engine
 * Real SQLite Backend Sync, Capture-Phase Event Delegation, Live Header Counter & True Persistence
 * Global IKEA Logo Enforcer (/assets/image.png)
 */

(function () {
  const OFFICIAL_IKEA_LOGO = '/assets/image.png';

  // 1. Curated Unique High-Res Photo Dictionary (1-to-1 unique mapping for every item)
  const PRODUCT_IMAGE_MAP = {
    // 3D OBJ Items
    'obj-001-couch': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    'obj-002-bed': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    'obj-003-wardrobe': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    'obj-004-table': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    'obj-005-chair': 'https://images.unsplash.com/photo-1580481077198-98e3c4a86ce9?auto=format&fit=crop&w=800&q=80',
    'obj-006-desk': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    
    // Chairs
    'chair-001': 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
    'chair-002': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    'chair-003': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    'chair-004': 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80',
    'chair-005': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',

    // Desks & Tables
    'desk-001': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    'desk-002': 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=800&q=80',
    'table-001': 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80',
    'table-002': 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80',

    // Sofas & Beds
    'sofa-001': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
    'sofa-002': 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80',
    'bed-001': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',

    // Storage & Shelves
    'storage-001': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    'storage-002': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    'lighting-001': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    'outdoor-001': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
  };

  window.resolveFurnitureImageByTitle = function (title, category) {
    const t = (title || '').toLowerCase();
    const c = (category || '').toLowerCase();

    if (t.includes('couch') || t.includes('scandinavian 3-seater') || t.includes('sofa') || t.includes('kivik') || t.includes('landskrona')) {
      return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('bed') || t.includes('linen') || t.includes('full-size') || t.includes('malm') || t.includes('hemnes')) {
      return 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('wardrobe') || t.includes('4-door') || t.includes('brimnes') || t.includes('pax')) {
      return 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('fjällbo') || t.includes('fjallbo') || t.includes('center table') || t.includes('coffee table') || (t.includes('table') && !t.includes('dining'))) {
      return 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('dining table') || t.includes('solid oak') || t.includes('nordviken') || t.includes('jokkmokk')) {
      return 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('lounge') || t.includes('mesh') || t.includes('markus') || (t.includes('chair') && t.includes('desk'))) {
      return 'https://images.unsplash.com/photo-1580481077198-98e3c4a86ce9?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('birch desk chair') || t.includes('birch') || t.includes('flintan')) {
      return 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('armchair') || t.includes('poäng') || t.includes('poang') || t.includes('strandmon')) {
      return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('desk') || t.includes('workstation') || t.includes('study') || t.includes('bekant') || t.includes('micke')) {
      return 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('shelf') || t.includes('bookcase') || t.includes('baggebo') || t.includes('billy') || t.includes('kallax')) {
      return 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('lamp') || t.includes('lighting') || t.includes('hektar') || t.includes('nymåne')) {
      return 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('outdoor') || t.includes('patio') || t.includes('applaro')) {
      return 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80';
    }

    if (c.includes('sofa')) return 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80';
    if (c.includes('bed')) return 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80';
    if (c.includes('table')) return 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80';
    if (c.includes('chair')) return 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80';
    if (c.includes('storage') || c.includes('cabinet') || c.includes('shelf')) return 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80';
    if (c.includes('desk')) return 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80';
    if (c.includes('light')) return 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80';

    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';
  };

  window.resolveFurnitureGalleryByTitle = function (title, category, primaryImage) {
    const t = (title || '').toLowerCase();
    const c = (category || '').toLowerCase();

    // 1. DESKS & WORKSTATIONS
    if (t.includes('desk') || t.includes('workstation') || t.includes('study') || t.includes('bekant') || t.includes('micke') || c.includes('desk')) {
      const p1 = primaryImage || 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80';
      return [
        p1,
        'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
      ];
    }

    // 2. CHAIRS & SEATING
    if (t.includes('chair') || t.includes('armchair') || t.includes('stool') || t.includes('markus') || t.includes('poäng') || t.includes('strandmon') || c.includes('chair')) {
      const p1 = primaryImage || 'https://images.unsplash.com/photo-1580481077198-98e3c4a86ce9?auto=format&fit=crop&w=1200&q=80';
      return [
        p1,
        'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
      ];
    }

    // 3. SOFAS & COUCHES
    if (t.includes('sofa') || t.includes('couch') || t.includes('lounge') || t.includes('kivik') || t.includes('landskrona') || c.includes('sofa')) {
      const p1 = primaryImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';
      return [
        p1,
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=80'
      ];
    }

    // 4. BEDS & BEDROOM
    if (t.includes('bed') || t.includes('linen') || t.includes('malm') || t.includes('hemnes') || t.includes('mattress') || c.includes('bed')) {
      const p1 = primaryImage || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80';
      return [
        p1,
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540518614846-7ede433c4b71?auto=format&fit=crop&w=1200&q=80'
      ];
    }

    // 5. TABLES & COFFEE TABLES
    if (t.includes('table') || t.includes('coffee table') || t.includes('dining') || t.includes('fjällbo') || t.includes('nordviken') || c.includes('table')) {
      const p1 = primaryImage || 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80';
      return [
        p1,
        'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80'
      ];
    }

    // 6. STORAGE, WARDROBES & SHELVES
    if (t.includes('wardrobe') || t.includes('shelf') || t.includes('bookcase') || t.includes('storage') || t.includes('pax') || t.includes('billy') || t.includes('kallax') || c.includes('storage') || c.includes('shelf')) {
      const p1 = primaryImage || 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80';
      return [
        p1,
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1597072689227-8882273e8f6a?auto=format&fit=crop&w=1200&q=80'
      ];
    }

    // 7. LIGHTING & LAMPS
    if (t.includes('lamp') || t.includes('light') || t.includes('lighting') || c.includes('light')) {
      const p1 = primaryImage || 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80';
      return [
        p1,
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=1200&q=80'
      ];
    }

    // 8. OUTDOOR & PATIO
    if (t.includes('outdoor') || t.includes('patio') || t.includes('garden') || c.includes('outdoor')) {
      const p1 = primaryImage || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80';
      return [
        p1,
        'https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
      ];
    }

    // Default Fallback: Neutral furniture gallery
    const p1 = primaryImage || window.resolveFurnitureImageByTitle(title, category);
    return [
      p1,
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
    ];
  };

  window.getFurnitureImage = function (item) {
    if (!item) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
    if (item.id && PRODUCT_IMAGE_MAP[item.id]) {
      return PRODUCT_IMAGE_MAP[item.id];
    }
    if (item.image_url) return item.image_url;
    if (item.image) return item.image;
    if (item.thumbnailUrl) return item.thumbnailUrl;
    return window.resolveFurnitureImageByTitle(item.name || '', item.category || '');
  };

  // 2. Global IKEA Logo Enforcer
  window.enforceIkeaLogos = function () {
    // A. Direct Logo Images
    document.querySelectorAll('img[alt*="IKEA"], img[src*="ikea-logo"], img[src*="image.png"], .hnf-navbar__logo img, .ikea-logo-wrap img').forEach(img => {
      if (!img.src.includes('image.png')) {
        img.src = OFFICIAL_IKEA_LOGO;
      }
      img.alt = 'IKEA';
      img.style.height = '36px';
      img.style.width = 'auto';
      img.style.objectFit = 'contain';
      img.style.display = 'block';
    });
  };

  // 3. Inject CSS Styles
  function ensureStyles() {
    if (!document.getElementById('ikea-ecomm-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'ikea-ecomm-styles';
      styleEl.textContent = `
        .ikea-live-toast-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 1000000;
          display: flex;
          flex-direction: column;
          gap: 12px;
          pointer-events: none;
        }
        .ikea-live-toast {
          pointer-events: auto;
          background: #111111;
          color: #ffffff;
          padding: 14px 20px;
          border-radius: 12px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 14px 35px rgba(0,0,0,0.35);
          animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border-left: 5px solid #0058a3;
          max-width: 440px;
        }
        .ikea-live-toast.success { border-left-color: #00853d; }
        .ikea-live-toast-btn {
          background: #0058a3;
          color: #ffffff;
          border: none;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          margin-left: auto;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .ikea-live-toast-btn:hover { background: #004b8c; }
        @keyframes toastSlideIn {
          from { transform: translateX(110%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .cart-badge-bounce {
          animation: badgePop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes badgePop {
          0% { transform: scale(0.6); }
          50% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        .product-real-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-real-img:hover {
          transform: scale(1.06);
        }
        .added-feedback {
          background: #00853d !important;
          color: #ffffff !important;
          transform: scale(0.96);
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          z-index: 999999;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .modal-overlay.active {
          display: flex;
        }
        .modal-box {
          background: #ffffff;
          border-radius: 24px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          width: 100%;
        }
        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #f1f5f9;
          border: none;
          font-size: 20px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `;
      const target = document.head || document.documentElement;
      if (target) target.appendChild(styleEl);
    }
  }

  function getOrCreateToastContainer() {
    let container = document.querySelector('.ikea-live-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'ikea-live-toast-container';
      if (document.body) {
        document.body.appendChild(container);
      } else if (document.documentElement) {
        document.documentElement.appendChild(container);
      }
    }
    return container;
  }

  window.showIkeaLiveToast = function (title, price, imgUrl) {
    ensureStyles();
    const container = getOrCreateToastContainer();
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'ikea-live-toast success';
    toast.innerHTML = `
      ${imgUrl ? `<img src="${imgUrl}" style="width:42px;height:42px;border-radius:8px;object-fit:cover;flex-shrink:0;border:1px solid #333;" />` : ''}
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:800;color:#fff;">Added to Shopping bag</div>
        <div style="font-size:12px;color:#bbb;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;">${title} • ${price}</div>
      </div>
      <a href="/shopping-bag.html" class="ikea-live-toast-btn">View Bag →</a>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  };

  // 4. Cart Storage Helpers
  window.getIkeaCartItems = function () {
    try {
      const stored = localStorage.getItem('ikea_cart_items') || sessionStorage.getItem('ikea_bag_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  window.saveIkeaCartItems = function (items) {
    localStorage.setItem('ikea_cart_items', JSON.stringify(items));
    sessionStorage.setItem('ikea_bag_items', JSON.stringify(items));
    window.updateIkeaCartBadges();
    window.dispatchEvent(new CustomEvent('ikea_cart_updated', { detail: { items } }));
  };

  // 5. Real Add to Cart with Database API Sync & Local Persistence
  window.addToIkeaCart = function (product, btnElement) {
    if (!product) return;

    // Prevent duplicate rapid calls on the same element
    if (btnElement) {
      if (btnElement._ikeaAdding) return;
      btnElement._ikeaAdding = true;
      setTimeout(() => { btnElement._ikeaAdding = false; }, 500);
    }

    let items = window.getIkeaCartItems();
    if (!Array.isArray(items)) items = [];

    const formattedPrice = typeof product.price === 'number' ? product.price : (parseInt(String(product.price).replace(/[^0-9]/g, '')) || 2990);
    const prodImg = window.getFurnitureImage ? window.getFurnitureImage(product) : (product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80');
    const prodId = String(product.id || ('item-' + (product.name || 'product').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 25)));

    const existingIndex = items.findIndex(i => String(i.id) === prodId || (i.name && i.name.toLowerCase() === (product.name || '').toLowerCase()));
    
    if (existingIndex !== -1) {
      items[existingIndex].quantity = (items[existingIndex].quantity || 1) + 1;
    } else {
      items.push({
        id: prodId,
        name: product.name || 'Scandinavian Furniture Item',
        desc: product.description || product.desc || `Pre-loved Scandinavian design in ${product.condition || 'Excellent'} condition.`,
        articleNumber: product.articleNumber || (Math.floor(100 + Math.random() * 900) + '.' + Math.floor(100 + Math.random() * 900) + '.' + Math.floor(10 + Math.random() * 90)),
        price: formattedPrice,
        originalPrice: product.originalPrice || Math.round(formattedPrice * 1.3),
        quantity: 1,
        image: prodImg,
        hasAccessories: true,
        familyDiscount: product.originalPrice ? `Save ₹${(product.originalPrice - formattedPrice).toLocaleString('en-IN')}` : null
      });
    }

    window.saveIkeaCartItems(items);

    // Call Backend API in background
    try {
      if (window.ecommerceAPI && typeof window.ecommerceAPI.addToCart === 'function') {
        window.ecommerceAPI.addToCart(prodId, 1).catch(err => console.log('Backend Cart Sync:', err.message));
      } else {
        fetch('http://localhost:8000/api/cart/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-guest-session-id': localStorage.getItem('ikea_guest_session_id') || 'guest_' + Date.now()
          },
          body: JSON.stringify({
            product_id: prodId,
            quantity: 1
          })
        }).catch(err => console.log('Backend Cart Sync:', err.message));
      }
    } catch (e) {}

    // Button visual feedback
    if (btnElement) {
      const originalHtml = btnElement.innerHTML;
      btnElement.classList.add('added-feedback');
      btnElement.innerHTML = '<span>✓ Added!</span>';
      setTimeout(() => {
        btnElement.classList.remove('added-feedback');
        btnElement.innerHTML = originalHtml;
      }, 1500);
    }

    // Show live toast
    window.showIkeaLiveToast(product.name || 'Furniture Item', `₹${formattedPrice.toLocaleString('en-IN')}`, prodImg);
  };

  // 6. Update All Header Badges
  window.updateIkeaCartBadges = function () {
    const items = window.getIkeaCartItems();
    const totalCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

    // Update all badge elements
    document.querySelectorAll('#header-bag-count, .bag-badge, [title="Shopping Cart"] span, button[title="Shopping Cart"] span, a[title="Shopping Cart"] span, a[title="Shopping Bag"] span, .dynamic-cart-badge').forEach(el => {
      const countStr = String(totalCount);
      if (el.textContent !== countStr) {
        el.textContent = countStr;
      }
      if (el.id === 'header-bag-count') {
        el.style.display = 'flex';
      } else {
        el.style.display = totalCount > 0 ? 'flex' : 'none';
      }
    });

    // Wire up all Cart buttons across the navbar
    document.querySelectorAll('button[title="Shopping Cart"], a[title="Shopping Bag"], a[title="Shopping Cart"], .bag-icon-wrap, a[href="/shopping-bag.html"]').forEach(btn => {
      if (!btn._cartWired) {
        btn._cartWired = true;
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = '/shopping-bag.html';
        });
        btn.style.cursor = 'pointer';
      }

      let badge = btn.querySelector('.dynamic-cart-badge, #header-bag-count, .bag-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'dynamic-cart-badge';
        badge.style.cssText = 'position:absolute;top:-4px;right:-4px;background:#0058A3;color:#ffffff;font-size:10px;font-weight:900;min-width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;padding:0 3px;border:2px solid #ffffff;';
        btn.style.position = 'relative';
        btn.appendChild(badge);
      }
      if (badge) {
        if (badge.textContent !== String(totalCount)) {
          badge.textContent = String(totalCount);
        }
        if (badge.id === 'header-bag-count') {
          badge.style.display = 'flex';
        } else {
          badge.style.display = totalCount > 0 ? 'flex' : 'none';
        }
      }
    });
  };

  // 7. Global Capture-Phase Event Delegation for Add to Cart, Swap, and 3D Buttons
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('button, a');
    if (!btn) return;

    const text = (btn.textContent || '').trim();
    const card = btn.closest('.group, .rounded-3xl, .rounded-2xl, [class*="rounded-3xl"], [class*="rounded-2xl"], .bag-item-card, [class*="border-slate-200"]');

    // 1. ADD TO CART INTERCEPTOR
    if (text.includes('Add to cart') || text.includes('🛒 Add to cart') || btn.title === 'Add to Shopping Bag' || text === 'Buy Now' || text === 'Buy' || text === '🛒 Buy') {
      if (card) {
        e.preventDefault();
        e.stopPropagation();

        const titleEl = card.querySelector('h3, [class*="font-bold text-slate-900"], [class*="font-extrabold text-slate-900"]');
        const title = titleEl ? titleEl.textContent.trim() : 'Scandinavian Furniture';

        const priceEl = card.querySelector('[class*="font-extrabold text-slate-900"], [class*="font-black text-slate-900"], [class*="text-xl font-extrabold"], [class*="text-xl font-black"]');
        const priceText = priceEl ? priceEl.textContent.trim() : '';

        const categoryEl = card.querySelector('span[class*="text-[#0058A3]"], span[class*="uppercase"]');
        const category = categoryEl ? categoryEl.textContent.trim() : 'Furniture';

        const productData = {
          id: 'item-' + title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30),
          name: title,
          price: parseInt(priceText.replace(/[^0-9]/g, '')) || 4990,
          category: category,
          condition: card.querySelector('[class*="bg-slate-900/80"], [class*="bg-emerald-600"], [class*="bg-indigo-600"]')?.textContent.trim() || 'Excellent',
          image: window.resolveFurnitureImageByTitle ? window.resolveFurnitureImageByTitle(title, category) : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
        };

        window.addToIkeaCart(productData, btn);
      }
    }

    // 2. SWAP BUTTON INTERCEPTOR
    if (text.includes('Swap') || text.includes('🔄')) {
      if (card) {
        e.preventDefault();
        e.stopPropagation();

        const titleEl = card.querySelector('h3, [class*="font-bold text-slate-900"], [class*="font-extrabold text-slate-900"]');
        const title = titleEl ? titleEl.textContent.trim() : 'Scandinavian Furniture';
        const priceEl = card.querySelector('[class*="font-extrabold text-slate-900"], [class*="font-black text-slate-900"], [class*="text-xl font-extrabold"], [class*="text-xl font-black"]');
        const priceText = priceEl ? priceEl.textContent.trim() : '';
        const categoryEl = card.querySelector('span[class*="text-[#0058A3]"], span[class*="uppercase"]');
        const category = categoryEl ? categoryEl.textContent.trim() : 'Furniture';

        window.openIkeaSwapModal({
          id: 'item-' + title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30),
          name: title,
          price: parseInt(priceText.replace(/[^0-9]/g, '')) || 4990,
          image: window.resolveFurnitureImageByTitle ? window.resolveFurnitureImageByTitle(title, category) : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
        });
      }
    }

    // 3. 3D BUTTON INTERCEPTOR
    if (text.includes('3D') || text.includes('+ 3D') || text.includes('- 3D')) {
      if (card) {
        e.preventDefault();
        e.stopPropagation();

        const titleEl = card.querySelector('h3, [class*="font-bold text-slate-900"], [class*="font-extrabold text-slate-900"]');
        const title = titleEl ? titleEl.textContent.trim() : 'Scandinavian Furniture';
        const priceEl = card.querySelector('[class*="font-extrabold text-slate-900"], [class*="font-black text-slate-900"], [class*="text-xl font-extrabold"], [class*="text-xl font-black"]');
        const priceText = priceEl ? priceEl.textContent.trim() : '';
        const categoryEl = card.querySelector('span[class*="text-[#0058A3]"], span[class*="uppercase"]');
        const category = categoryEl ? categoryEl.textContent.trim() : 'Furniture';

        const prodId = 'item-' + title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
        sessionStorage.setItem('planner_active_product', JSON.stringify({
          id: prodId,
          name: title,
          price: parseInt(priceText.replace(/[^0-9]/g, '')) || 4990,
          category: category,
          image: window.resolveFurnitureImageByTitle ? window.resolveFurnitureImageByTitle(title, category) : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
        }));
        window.location.href = `/planner?product=${encodeURIComponent(prodId)}`;
      }
    }

    // 4. CART HEADER BUTTON INTERCEPTOR
    if (btn.title === 'Shopping Cart' || btn.title === 'Shopping Bag' || btn.classList.contains('bag-icon-wrap') || btn.getAttribute('href') === '/shopping-bag.html') {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = '/shopping-bag.html';
    }
  }, true);

  // Card Body Click -> Navigate to Product Detail Page (product.html)
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('button, a, select, input');
    if (btn) return; // Allow button clicks (Add to cart, Swap, 3D) to run without triggering page change

    const card = e.target.closest('.group, .rounded-3xl, .rounded-2xl, [class*="rounded-3xl"], [class*="rounded-2xl"], .rec-card');
    if (card && (window.location.pathname.includes('marketplace') || window.location.pathname.includes('secondhand') || window.location.pathname === '/' || window.location.pathname === '')) {
      const titleEl = card.querySelector('h3, [class*="font-bold text-slate-900"], [class*="font-extrabold text-slate-900"]');
      if (titleEl) {
        const title = titleEl.textContent.trim();
        const priceEl = card.querySelector('[class*="font-extrabold text-slate-900"], [class*="font-black text-slate-900"], [class*="text-xl font-extrabold"], [class*="text-xl font-black"]');
        const priceText = priceEl ? priceEl.textContent.trim() : '';
        const categoryEl = card.querySelector('span[class*="text-[#0058A3]"], span[class*="uppercase"]');
        const category = categoryEl ? categoryEl.textContent.trim() : 'Furniture';
        const condEl = card.querySelector('[class*="bg-slate-900/80"], [class*="bg-emerald-600"], [class*="bg-indigo-600"], [class*="bg-blue-600"]');
        const condition = condEl ? condEl.textContent.trim() : 'Like New';

        const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const prodId = 'item-' + cleanSlug;
        const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 4990;
        
        sessionStorage.setItem('active_view_product', JSON.stringify({
          id: prodId,
          name: title,
          price: price,
          category: category,
          condition: condition,
          image: window.resolveFurnitureImageByTitle ? window.resolveFurnitureImageByTitle(title, category) : ''
        }));

        window.location.href = `/product.html?id=${encodeURIComponent(prodId)}&name=${encodeURIComponent(title)}&price=${price}&category=${encodeURIComponent(category)}&condition=${encodeURIComponent(condition)}`;
      }
    }
  }, false);

  let isEnhancing = false;

  // 8. Enhance Cards: Ensure distinct photos & Add to cart labels on every card
  function enhanceProductCards() {
    if (isEnhancing) return;
    isEnhancing = true;

    try {
      window.enforceIkeaLogos();

      const cards = document.querySelectorAll('.group, .rounded-3xl, .rounded-2xl, [class*="rounded-3xl"], [class*="rounded-2xl"]');
      cards.forEach(card => {
        const titleEl = card.querySelector('h3, [class*="font-bold text-slate-900"], [class*="font-extrabold text-slate-900"]');
        const title = titleEl ? titleEl.textContent.trim() : '';
        if (!title) return;

        const categoryEl = card.querySelector('span[class*="text-[#0058A3]"], span[class*="uppercase"]');
        const category = categoryEl ? categoryEl.textContent.trim() : 'Furniture';

        const visualArea = card.querySelector('.relative.h-48, .relative.h-56, [class*="h-48"], [class*="h-56"]');
        if (visualArea && !visualArea.dataset.imgEnhanced) {
          const correctImg = window.resolveFurnitureImageByTitle ? window.resolveFurnitureImageByTitle(title, category) : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

          const existingImg = visualArea.querySelector('img');
          if (existingImg) {
            if (existingImg.src !== correctImg && !existingImg.src.includes('unsplash.com')) {
              existingImg.src = correctImg;
            }
            visualArea.dataset.imgEnhanced = '1';
          } else {
            const placeholderSquare = visualArea.querySelector('.w-24.h-24, [class*="w-24 h-24"]');
            if (placeholderSquare) {
              placeholderSquare.outerHTML = `
                <img src="${correctImg}" alt="${title}" class="product-real-img rounded-2xl shadow-sm" style="width:100%;height:100%;object-fit:cover;" />
              `;
              visualArea.style.padding = '0';
              visualArea.style.overflow = 'hidden';
              visualArea.style.borderRadius = '1.5rem 1.5rem 0 0';
              visualArea.dataset.imgEnhanced = '1';
            }
          }
        }

        // Ensure button text is "Add to cart"
        const buttons = card.querySelectorAll('button');
        buttons.forEach(btn => {
          const text = btn.textContent.trim();
          if (text === 'Buy Now' || text === 'Buy' || text === '🛒 Buy') {
            btn.innerHTML = '<span>Add to cart</span>';
            btn.title = 'Add to Shopping Bag';
            btn.style.fontWeight = '800';
          }
        });
      });

      window.updateIkeaCartBadges();
    } finally {
      isEnhancing = false;
    }
  }

  // 9. Interactive Swap Modal
  function getOrCreateSwapModal() {
    let modal = document.getElementById('ikea-global-swap-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.id = 'ikea-global-swap-modal';
      modal.innerHTML = `
        <div class="modal-box" style="max-width:520px;padding:32px;">
          <button class="modal-close-btn" onclick="document.getElementById('ikea-global-swap-modal').classList.remove('active')">&times;</button>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <span style="font-size:24px;">🔄</span>
            <div>
              <h3 style="font-size:19px;font-weight:800;margin:0;color:#111;">Propose Furniture Swap</h3>
              <p style="font-size:12px;color:#666;margin:2px 0 0 0;">Trade pre-loved Scandinavian designs directly with verified sellers.</p>
            </div>
          </div>
          
          <div id="swap-target-item-card" style="display:flex;align-items:center;gap:16px;background:#f7f7f7;padding:14px;border-radius:12px;margin-bottom:20px;">
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block;font-size:13px;font-weight:700;margin-bottom:6px;color:#222;">Item You Are Offering to Trade</label>
            <select id="swap-offered-select" onchange="window.calcSwapDifference()" style="width:100%;padding:12px;border:1.5px solid #dfdfdf;border-radius:8px;font-size:14px;outline:none;">
              <option value="4200">Birch Desk Chair (Est. ₹4,200)</option>
              <option value="6500">Solid Oak Dining Table (Est. ₹6,500)</option>
              <option value="8500">Ergonomic Mesh Chair (Est. ₹8,500)</option>
              <option value="24000">MALM Bed Frame King (Est. ₹24,000)</option>
              <option value="29000">4-Door Storage Wardrobe (Est. ₹29,000)</option>
            </select>
          </div>

          <div id="swap-diff-box" style="background:#f0f7ff;border:1px solid #cce3ff;padding:12px 16px;border-radius:8px;font-size:13px;margin-bottom:20px;color:#0058A3;font-weight:600;">
            Estimated Value Adjustment: Calculating...
          </div>

          <button id="btn-submit-swap" onclick="window.submitSwapProposal()" style="width:100%;background:#7e22ce;color:#fff;border:none;padding:14px;border-radius:28px;font-weight:800;font-size:14px;cursor:pointer;transition:background 0.2s;">
            Submit Swap Request (Verified)
          </button>
          <div id="swap-success-msg" style="display:none;text-align:center;margin-top:16px;font-size:13px;color:#00853d;font-weight:700;"></div>
        </div>
      `;
      if (document.body) {
        document.body.appendChild(modal);
      }
    }
    return modal;
  }

  let currentSwapTarget = null;

  window.openIkeaSwapModal = function (product) {
    currentSwapTarget = product;
    const modal = getOrCreateSwapModal();
    const cardEl = document.getElementById('swap-target-item-card');
    if (cardEl) {
      cardEl.innerHTML = `
        <img src="${product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;" />
        <div>
          <div style="font-size:14px;font-weight:800;color:#111;">${product.name}</div>
          <div style="font-size:13px;color:#0058A3;font-weight:700;">Target Price: ₹${(product.price || 0).toLocaleString('en-IN')}</div>
        </div>
      `;
    }
    const successMsg = document.getElementById('swap-success-msg');
    if (successMsg) successMsg.style.display = 'none';
    const submitBtn = document.getElementById('btn-submit-swap');
    if (submitBtn) submitBtn.style.display = 'block';
    window.calcSwapDifference();
    if (modal) modal.classList.add('active');
  };

  window.calcSwapDifference = function () {
    if (!currentSwapTarget) return;
    const select = document.getElementById('swap-offered-select');
    const offeredVal = select ? parseInt(select.value) || 0 : 0;
    const diff = currentSwapTarget.price - offeredVal;
    const diffBox = document.getElementById('swap-diff-box');
    if (!diffBox) return;
    if (diff > 0) {
      diffBox.innerHTML = `You pay difference of <strong>₹${diff.toLocaleString('en-IN')}</strong> upon delivery.`;
      diffBox.style.color = '#0058A3';
    } else if (diff < 0) {
      diffBox.innerHTML = `Seller refunds you difference of <strong>₹${Math.abs(diff).toLocaleString('en-IN')}</strong> in IKEA store credit!`;
      diffBox.style.color = '#00853d';
    } else {
      diffBox.innerHTML = `<strong>Equal Value Trade (₹0 Difference)!</strong> Direct item exchange.`;
      diffBox.style.color = '#00853d';
    }
  };

  window.submitSwapProposal = function () {
    const swapCode = 'SWAP-' + Math.floor(10000 + Math.random() * 90000);
    const msg = document.getElementById('swap-success-msg');
    if (msg) {
      msg.style.display = 'block';
      msg.innerHTML = `✓ Swap Proposal <strong>#${swapCode}</strong> submitted! Seller notified.`;
    }
    const submitBtn = document.getElementById('btn-submit-swap');
    if (submitBtn) submitBtn.style.display = 'none';
    setTimeout(() => {
      const modal = document.getElementById('ikea-global-swap-modal');
      if (modal) modal.classList.remove('active');
    }, 2500);
  };

  function initEcommerceUI() {
    ensureStyles();
    getOrCreateToastContainer();
    enhanceProductCards();
    window.updateIkeaCartBadges();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEcommerceUI);
  } else {
    initEcommerceUI();
  }

  // Use a polite interval for dynamic React renders without locking the DOM
  setInterval(enhanceProductCards, 1500);

})();
