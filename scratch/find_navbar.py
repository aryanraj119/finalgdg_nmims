with open("c:/Users/ANANYA SINGH/ikeaaa/assets/app-bundle-v2.js", "r", encoding="utf-8") as f:
    content = f.read()

import re
pos_list = [m.start() for m in re.finditer(r'Shopping Cart|Try Demo Room', content)]
for pos in pos_list:
    snippet = content[max(0, pos-300):min(len(content), pos+400)]
    print("--- NAVBAR / CART AT", pos, "---")
    print(snippet.encode('ascii', 'replace').decode('ascii'))
