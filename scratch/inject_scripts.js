const fs = require('fs');

const files = [
  'index.html',
  'IKEA India-Affordable home furniture, designs & id.html',
  'secondhand.html',
  'marketplace.html'
];

const scriptTags = `
  <!-- IKEA & SPYLT Full E-Commerce Client (DB, Auth, Cart, Payments) -->
  <script src="/ecommerce-api.js"></script>
  <script src="/ecommerce-ui.js"></script>
`;

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('ecommerce-api.js')) {
      content = content.replace('</body>', `${scriptTags}\n</body>`);
      fs.writeFileSync(f, content, 'utf8');
      console.log(`Injected ecommerce scripts into ${f}`);
    } else {
      console.log(`Scripts already present in ${f}`);
    }
  }
});
