with open('assets/app-bundle-v2.js', 'r', encoding='utf-8') as f:
    c = f.read()

old_p = 'path:"/marketplace",element:b.jsx(C6,{})'
new_p = 'path:"/marketplace.html",element:b.jsx(C6,{})}),b.jsx(gl,{path:"/marketplace",element:b.jsx(C6,{})'

if old_p in c:
    c = c.replace(old_p, new_p, 1)
    with open('assets/app-bundle-v2.js', 'w', encoding='utf-8') as f:
        f.write(c)
    print('SUCCESS: Added /marketplace.html route!')
else:
    print('Pattern not found or already added')
