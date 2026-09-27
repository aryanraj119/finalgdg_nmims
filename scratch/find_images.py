import glob, re

for ext in ['*.html', '*.js', 'assets/*.js']:
    for f in glob.glob(ext):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            c = fp.read()
            imgs = re.findall(r'https://images\.unsplash\.com/[^\s"\'\)]+', c)
            if imgs:
                print(f, len(imgs), 'images found')
                for img in set(imgs):
                    print('  ', img)
