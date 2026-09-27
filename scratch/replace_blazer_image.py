import os, glob

OLD_IMG = "photo-1580481077198-98e3c4a86ce9"
NEW_IMG = "photo-1580481077198-98e3c4a86ce9"

count = 0
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root:
        continue
    for f in files:
        if f.endswith(('.js', '.html', '.ts', '.tsx', '.json', '.py', '.txt')):
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                if OLD_IMG in content:
                    updated = content.replace(OLD_IMG, NEW_IMG)
                    with open(p, 'w', encoding='utf-8') as fp:
                        fp.write(updated)
                    print(f"Replaced blazer image in: {p}")
                    count += 1
            except Exception as e:
                pass

print(f"Total files updated: {count}")
