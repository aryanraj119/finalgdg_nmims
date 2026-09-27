import re

with open("c:/Users/ANANYA SINGH/ikeaaa/assets/app-bundle-v2.js", "r", encoding="utf-8") as f:
    content = f.read()

print("Length of app-bundle-v2.js:", len(content))

# Look for card color visual placeholder
matches = [m.start() for m in re.finditer(r'style:\{backgroundColor:', content)]
print(f"Found {len(matches)} occurrences of style:{{backgroundColor:")
for pos in matches[:10]:
    snippet = content[max(0, pos-100):min(len(content), pos+300)]
    print("--- SNIPPET AT", pos, "---")
    print(snippet)
