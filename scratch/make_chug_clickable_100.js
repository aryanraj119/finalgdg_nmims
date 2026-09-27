const fs = require('fs');

// 1. Update intro.html, intro/index.html, spylt.html
const introHtml = `<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <link rel="icon" type="image/svg+xml" href="/assets/6744ffba83bf874c1073eb88_favicon-CD9UqQ9M.jpg" />
  <link rel="preload" href="/assets/ProximaNova-Regular-BkyKiRiS.otf" as="font" type="font/otf" crossorigin="anonymous">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPYLT — Protein + Caffeine</title>
  <script type="module" crossorigin src="/assets/app-bundle-v2.js?v=2.0.2"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-DR4cWJn1.css">
  <style>
    /* Ensure WebGL canvas allows mouse clicks through to HTML elements */
    canvas,
    #canvas,
    [class*="canvas"],
    video {
      pointer-events: none !important;
    }

    .hero-container {
      position: relative !important;
      z-index: 10 !important;
    }

    .hero-content {
      pointer-events: auto !important;
      position: relative !important;
      z-index: 50 !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
    }

    /* Highly visible, interactive CHUG A SPYLT button */
    .hero-button {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin-top: 20px !important;
      width: 215px !important;
      height: 52px !important;
      padding: 0 !important;
      background-color: #df974c !important;
      color: #2b170c !important;
      font-family: 'ProximaNova', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 15.5px !important;
      font-weight: 900 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      border-radius: 9999px !important;
      cursor: pointer !important;
      pointer-events: auto !important;
      position: relative !important;
      z-index: 999999 !important;
      box-shadow: 0 10px 28px rgba(223, 151, 76, 0.45) !important;
      transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, box-shadow 0.22s ease !important;
      text-decoration: none !important;
      user-select: none !important;
    }

    .hero-button:hover {
      background-color: #d88e42 !important;
      transform: translateY(-3px) scale(1.04) !important;
      box-shadow: 0 16px 36px rgba(223, 151, 76, 0.65) !important;
      color: #201007 !important;
    }

    .hero-button:active {
      transform: translateY(1px) scale(0.97) !important;
      box-shadow: 0 6px 16px rgba(223, 151, 76, 0.35) !important;
    }

    .hero-button a {
      color: inherit !important;
      text-decoration: none !important;
      cursor: pointer !important;
      pointer-events: auto !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      height: 100% !important;
      font-weight: inherit !important;
      letter-spacing: inherit !important;
    }
  </style>
</head>

<body>
  <div id="root"></div>

  <!-- Back to IKEA Store Floating Button -->
  <div style="position:fixed;bottom:24px;left:24px;z-index:999999;">
    <a href="/" style="display:inline-flex;align-items:center;gap:10px;background:#0058a3;color:#ffffff;padding:12px 20px;border-radius:30px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;font-weight:700;text-decoration:none;box-shadow:0 6px 20px rgba(0,88,163,0.4);transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      <span>Back to IKEA Store</span>
    </a>
  </div>

  <script>
    // Bulletproof click interceptor & coordinate hit tester
    function goToSecondhand() {
      window.location.href = '/secondhand.html';
    }

    // Capture phase event listener
    window.addEventListener('click', function(e) {
      // 1. Direct or closest button target
      if (e.target.closest('.hero-button, [class*="hero-button"], a[href*="secondhand"]') || 
          (e.target.textContent && e.target.textContent.trim().toLowerCase().includes('chug a spylt'))) {
        e.preventDefault();
        e.stopPropagation();
        goToSecondhand();
        return;
      }

      // 2. Coordinate fallback (in case any transparent layer sits over it)
      const btn = document.querySelector('.hero-button');
      if (btn) {
        const rect = btn.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          e.preventDefault();
          e.stopPropagation();
          goToSecondhand();
        }
      }
    }, true);

    // Ensure cursor pointer on hover
    window.addEventListener('mousemove', function(e) {
      const btn = document.querySelector('.hero-button');
      if (btn) {
        const rect = btn.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          document.body.style.cursor = 'pointer';
        } else if (document.body.style.cursor === 'pointer' && !e.target.closest('a, button')) {
          document.body.style.cursor = 'default';
        }
      }
    });
  </script>
  <!-- Full E-Commerce Client Integration -->
  <script src="/ecommerce-api.js"></script>
  <script src="/ecommerce-ui.js"></script>
</body>

</html>
`;

if (!fs.existsSync('intro')) fs.mkdirSync('intro');
fs.writeFileSync('intro/index.html', introHtml, 'utf8');
fs.writeFileSync('intro.html', introHtml, 'utf8');
fs.writeFileSync('spylt.html', introHtml, 'utf8');

// Also update assets/index-DR4cWJn1.css to ensure canvas pointer-events: none is permanent
let css = fs.readFileSync('assets/index-DR4cWJn1.css', 'utf8');
if (!css.includes('canvas{pointer-events:none')) {
  css += '\ncanvas,video{pointer-events:none !important;} .hero-content,.hero-button{pointer-events:auto !important; z-index:99999 !important; cursor:pointer !important;}';
  fs.writeFileSync('assets/index-DR4cWJn1.css', css, 'utf8');
}

console.log('Successfully made CHUG A SPYLT button 100% clickable & selectable!');
