with open('assets/index-CxpCrW08.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the Marketplace Buy button click handler
# Old in Marketplace:
# onClick:$=>{$.stopPropagation(),v(X),N(null)}
# where v(X) is setCheckoutItem(X)
# We replace it with:
# onClick:$=>{$.stopPropagation(),window.location.href="/checkout.html?productId="+X.id}
# and change "🛒 Buy" to "Buy Now"

print("1. Replacing Marketplace Buy button...")
old_mkt_btn = 'onClick:$=>{$.stopPropagation(),v(X),N(null)},className:"py-2 rounded-xl bg-[#0058A3] hover:bg-blue-800 text-white text-[11px] font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-1 cursor-pointer",children:b.jsx("span",{children:"🛒 Buy"})}'
new_mkt_btn = 'onClick:$=>{$.stopPropagation(),window.location.href="/checkout.html?productId="+X.id},className:"py-2 rounded-xl bg-[#0058A3] hover:bg-blue-800 text-white text-[11px] font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-1 cursor-pointer",children:b.jsx("span",{children:"Buy Now"})}'

if old_mkt_btn in content:
    content = content.replace(old_mkt_btn, new_mkt_btn, 1)
    print("Marketplace button replaced successfully!")
else:
    print("WARNING: old_mkt_btn not matched verbatim, looking for substring...")
    # Find around X.id
    idx = content.find('🛒 Buy')
    if idx != -1:
        print("Found 🛒 Buy at index", idx)
        start = max(0, idx - 150)
        end = min(len(content), idx + 50)
        print("Found:", repr(content[start:end]))

# Old in SecondHandFurniture:
# onClick:Pe=>{Pe.stopPropagation(),Y(te)},className:"flex-1 py-1.5 rounded-xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-[11px] shadow-sm transition-all cursor-pointer",children:"🛒 Buy"
print("\n2. Replacing SecondHandFurniture card Buy button...")
old_sh_btn = 'onClick:Pe=>{Pe.stopPropagation(),Y(te)},className:"flex-1 py-1.5 rounded-xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-[11px] shadow-sm transition-all cursor-pointer",children:"🛒 Buy"'
new_sh_btn = 'onClick:Pe=>{Pe.stopPropagation(),window.location.href="/checkout.html?productId=sh-00"+te.id},className:"flex-1 py-1.5 rounded-xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-[11px] shadow-sm transition-all cursor-pointer",children:"Buy Now"'

if old_sh_btn in content:
    content = content.replace(old_sh_btn, new_sh_btn, 1)
    print("SecondHandFurniture card button replaced successfully!")
else:
    print("WARNING: old_sh_btn not matched verbatim")

# Old in SecondHandFurniture Drawer:
# onClick:()=>{Y(J),fe(null)},className:"py-3 px-4 rounded-2xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 cursor-pointer",children:"[ BUY NOW ]"
print("\n3. Replacing Drawer Buy button...")
old_drawer_btn = 'onClick:()=>{Y(J),fe(null)},className:"py-3 px-4 rounded-2xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 cursor-pointer",children:"[ BUY NOW ]"'
new_drawer_btn = 'onClick:()=>{window.location.href="/checkout.html?productId=sh-00"+J.id},className:"py-3 px-4 rounded-2xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 cursor-pointer",children:"Buy Now"'

if old_drawer_btn in content:
    content = content.replace(old_drawer_btn, new_drawer_btn, 1)
    print("Drawer button replaced successfully!")
else:
    print("WARNING: old_drawer_btn not matched verbatim")

with open('assets/app-bundle-v2.js', 'w', encoding='utf-8') as f:
    f.write(content)

with open('nmimsgdg-main/assets/app-bundle-v2.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nDone writing assets/app-bundle-v2.js")
