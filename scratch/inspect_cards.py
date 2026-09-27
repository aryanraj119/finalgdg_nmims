with open("c:/Users/ANANYA SINGH/ikeaaa/assets/app-bundle-v2.js", "r", encoding="utf-8") as f:
    content = f.read()

snippet = content[504100:505600]
print("--- CARD RENDER SNIPPET ---")
print(snippet.encode('ascii', 'replace').decode('ascii'))
