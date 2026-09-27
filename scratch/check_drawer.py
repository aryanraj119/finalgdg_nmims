with open('assets/index-CxpCrW08.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('[ BUY NOW ]')
if idx != -1:
    print(f"Found [ BUY NOW ] at {idx}")
    with open('scratch/drawer_buy.txt', 'w', encoding='utf-8') as out:
        out.write(content[max(0, idx - 200):min(len(content), idx + 200)])
else:
    print("[ BUY NOW ] not found, searching for other variations...")
