with open("c:/Users/ANANYA SINGH/ikeaaa/assets/app-bundle-v2.js", "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = [m.start() for m in re.finditer(r'Add to cart', content)]
print(f"Found {len(matches)} occurrences of 'Add to cart' in app-bundle-v2.js:")
for pos in matches:
    print(content[max(0, pos-200):min(len(content), pos+200)].encode('ascii', 'replace').decode('ascii'))
    print("="*60)
