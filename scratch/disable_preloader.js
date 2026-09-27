const fs = require('fs');

// 1. Update intro/index.html & intro.html & spylt.html
const introHtml = `<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/assets/6744ffba83bf874c1073eb88_favicon-CD9UqQ9M.jpg" />
  <link rel="preload" href="/assets/ProximaNova-Regular-BkyKiRiS.otf" as="font" type="font/otf" crossorigin="anonymous">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPYLT — Protein + Caffeine</title>
  <script type="module" crossorigin src="/assets/index-CxpCrW08.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-DR4cWJn1.css">
  <style>
    body {
      background-color: #ffffff !important;
      color: #333333;
    }
    .preloader {
      display: none !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }
    .hero-content {
      opacity: 1 !important;
      pointer-events: auto !important;
    }
    .hero-button {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin-top: 20px !important;
      padding: 14px 44px !important;
      background-color: #df974c !important;
      color: #2b170c !important;
      font-family: 'ProximaNova', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 15px !important;
      font-weight: 800 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      border-radius: 9999px !important;
      cursor: pointer !important;
      box-shadow: 0 10px 28px rgba(223, 151, 76, 0.45) !important;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, box-shadow 0.2s ease !important;
      text-decoration: none !important;
      user-select: none !important;
      position: relative !important;
      z-index: 9999 !important;
    }
    .hero-button:hover {
      background-color: #d88e42 !important;
      transform: translateY(-3px) scale(1.04) !important;
      box-shadow: 0 16px 36px rgba(223, 151, 76, 0.6) !important;
    }
    .hero-button a {
      color: inherit !important;
      text-decoration: none !important;
      cursor: pointer !important;
      display: inline-block !important;
      width: 100% !important;
      height: 100% !important;
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
    document.addEventListener('click', function(e) {
      const heroBtn = e.target.closest('.hero-button, a[href*="secondhand"]');
      if (heroBtn || (e.target.textContent && e.target.textContent.toLowerCase().includes('chug a spylt'))) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/secondhand.html';
      }
    }, true);
  </script>
</body>

</html>
`;

// 2. Update secondhand/index.html & secondhand.html
const secondhandHtml = `<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/assets/6744ffba83bf874c1073eb88_favicon-CD9UqQ9M.jpg" />
  <link rel="preload" href="/assets/ProximaNova-Regular-BkyKiRiS.otf" as="font" type="font/otf" crossorigin="anonymous">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IKEA & SPYLT — Second-Hand Circular Hub & 3D Room Planner</title>
  <script type="module" crossorigin src="/assets/index-CxpCrW08.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-DR4cWJn1.css">
  <style>
    body {
      background-color: #f5f5f5 !important;
    }
    .preloader {
      display: none !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }
  </style>
</head>

<body>
  <div id="root"></div>

  <!-- Bottom Navigation Buttons -->
  <div style="position:fixed;bottom:24px;left:24px;z-index:999999;display:flex;gap:12px;">
    <a href="/intro/" style="display:inline-flex;align-items:center;gap:8px;background:#e9aa56;color:#2b1b17;padding:12px 18px;border-radius:30px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;font-weight:700;text-decoration:none;box-shadow:0 6px 20px rgba(0,0,0,0.25);transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
      <span>&larr; Back to SPYLT</span>
    </a>
    <a href="/" style="display:inline-flex;align-items:center;gap:8px;background:#0058a3;color:#ffffff;padding:12px 18px;border-radius:30px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;font-weight:700;text-decoration:none;box-shadow:0 6px 20px rgba(0,88,163,0.4);transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      <span>Back to IKEA Store</span>
    </a>
  </div>
</body>

</html>
`;

if (!fs.existsSync('intro')) fs.mkdirSync('intro');
fs.writeFileSync('intro/index.html', introHtml, 'utf8');
fs.writeFileSync('intro.html', introHtml, 'utf8');
fs.writeFileSync('spylt.html', introHtml, 'utf8');

if (!fs.existsSync('secondhand')) fs.mkdirSync('secondhand');
fs.writeFileSync('secondhand/index.html', secondhandHtml, 'utf8');
fs.writeFileSync('secondhand.html', secondhandHtml, 'utf8');
fs.writeFileSync('marketplace.html', secondhandHtml, 'utf8');
fs.writeFileSync('planner.html', secondhandHtml, 'utf8');

console.log('Disabled blocking preloader overlay and set clean body backgrounds.');
