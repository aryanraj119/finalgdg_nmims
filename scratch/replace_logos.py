import os
import re

files = [
    'index.html',
    'IKEA India-Affordable home furniture, designs & id.html',
    'checkout.html',
    'checkout/index.html',
    'shopping-bag.html',
    'marketplace.html',
    'secondhand.html',
    'planner.html'
]

for fn in files:
    if os.path.exists(fn):
        with open(fn, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        orig_len = len(content)
        
        # Replace base64 logo
        content = re.sub(
            r'<div class="hnf-navbar__logo"><a[^>]*><img[^>]*src="data:image/svg\+xml;base64,[^"]+"[^>]*></a>',
            '<div class="hnf-navbar__logo"><a data-skapa="hyperlink@9.1.1" data-tracking-label="ikea-logo" aria-label="IKEA Home" href="/" class="hnf-link"><img src="/assets/image.png" alt="IKEA" style="height:36px;width:auto;object-fit:contain;display:block;" /></a>',
            content
        )
        
        content = content.replace('/assets/ikea-logo.png', '/assets/image.png')
        content = content.replace('/assets/ikea-logo.svg', '/assets/image.png')
        
        with open(fn, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {fn}: {orig_len} -> {len(content)}")
