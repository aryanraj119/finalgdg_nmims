with open("c:/Users/ANANYA SINGH/ikeaaa/assets/app-bundle-v2.js", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Find the card visual placeholder in app-bundle-v2.js
idx = content.find('rounded-2xl shadow-md border-2 border-white flex items-center justify-center')
if idx != -1:
    print("Found placeholder 1 at", idx)
    print(content[max(0, idx-150):min(len(content), idx+300)].encode('ascii', 'replace').decode('ascii'))

idx2 = content.find('rounded-3xl shadow-xl flex items-center justify-center border-4 border-white')
if idx2 != -1:
    print("Found placeholder 2 at", idx2)
    print(content[max(0, idx2-150):min(len(content), idx2+300)].encode('ascii', 'replace').decode('ascii'))
