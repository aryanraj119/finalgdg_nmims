with open("c:/Users/ANANYA SINGH/ikeaaa/assets/app-bundle-v2.js", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find('grid grid-cols-3 gap-1.5 pt-1')
while idx != -1:
    print("Found action grid at", idx)
    print(content[idx:idx+450].encode('ascii', 'replace').decode('ascii'))
    idx = content.find('grid grid-cols-3 gap-1.5 pt-1', idx+1)
