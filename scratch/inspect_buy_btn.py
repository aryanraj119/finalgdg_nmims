with open("c:/Users/ANANYA SINGH/ikeaaa/assets/app-bundle-v2.js", "r", encoding="utf-8") as f:
    content = f.read()

snippet = content[505400:506800]
print("--- BUY BUTTON SNIPPET ---")
print(snippet.encode('ascii', 'replace').decode('ascii'))
