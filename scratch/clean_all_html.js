const fs = require('fs');

const originalHtml = `<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/assets/6744ffba83bf874c1073eb88_favicon-CD9UqQ9M.jpg" />
  <link rel="preload" href="/assets/ProximaNova-Regular-BkyKiRiS.otf" as="font" type="font/otf"
    crossorigin="anonymous">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPYLT — Protein + Caffeine</title>
  <script type="module" crossorigin src="/assets/index-CxpCrW08.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-DR4cWJn1.css">
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
</body>

</html>
`;

if (!fs.existsSync('intro')) fs.mkdirSync('intro');
fs.writeFileSync('intro/index.html', originalHtml, 'utf8');
fs.writeFileSync('intro.html', originalHtml, 'utf8');
fs.writeFileSync('spylt.html', originalHtml, 'utf8');

if (!fs.existsSync('secondhand')) fs.mkdirSync('secondhand');
fs.writeFileSync('secondhand/index.html', originalHtml, 'utf8');
fs.writeFileSync('secondhand.html', originalHtml, 'utf8');
fs.writeFileSync('marketplace.html', originalHtml, 'utf8');
fs.writeFileSync('planner.html', originalHtml, 'utf8');

console.log('Restored pure, clean HTML templates across all routes.');
