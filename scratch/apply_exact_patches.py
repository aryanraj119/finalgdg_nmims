import os

def apply_exact_patches():
    with open('assets/index-CxpCrW08.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Marketplace Buy Button
    target1 = 'b.jsx("button",{onClick:$=>{$.stopPropagation(),v(X),U(null)},className:"py-2 rounded-xl bg-[#0058A3] hover:bg-blue-800 text-white text-[11px] font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-1 cursor-pointer",children:b.jsx("span",{children:"🛒 Buy"})})'
    repl1 = 'b.jsx("button",{onClick:$=>{$.stopPropagation(),window.location.href="/checkout.html?productId="+X.id},className:"py-2 rounded-xl bg-[#0058A3] hover:bg-blue-800 text-white text-[11px] font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-1 cursor-pointer",children:b.jsx("span",{children:"Buy Now"})})'

    if target1 in content:
        content = content.replace(target1, repl1, 1)
        print("Success 1: Marketplace buy button patched!")
    else:
        print("Error 1: target1 not found")

    # 2. SecondHandFurniture Card Buy Button
    target2 = 'b.jsx("button",{onClick:Pe=>{Pe.stopPropagation(),Y(te)},className:"flex-1 py-1.5 rounded-xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-[11px] shadow-sm transition-all cursor-pointer",children:"🛒 Buy"})'
    repl2 = 'b.jsx("button",{onClick:Pe=>{Pe.stopPropagation(),window.location.href="/checkout.html?productId=sh-00"+te.id},className:"flex-1 py-1.5 rounded-xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-[11px] shadow-sm transition-all cursor-pointer",children:"Buy Now"})'

    if target2 in content:
        content = content.replace(target2, repl2, 1)
        print("Success 2: SecondHandFurniture card buy button patched!")
    else:
        print("Error 2: target2 not found")

    # 3. SecondHandFurniture Drawer Buy Button
    target3 = 'b.jsx("button",{onClick:()=>{Y(I),B(null)},className:"py-3 px-4 rounded-2xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 cursor-pointer",children:"[ BUY NOW ]"})'
    repl3 = 'b.jsx("button",{onClick:()=>{window.location.href="/checkout.html?productId=sh-00"+I.id},className:"py-3 px-4 rounded-2xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 cursor-pointer",children:"Buy Now"})'

    if target3 in content:
        content = content.replace(target3, repl3, 1)
        print("Success 3: SecondHandFurniture drawer buy button patched!")
    else:
        print("Error 3: target3 not found")

    with open('assets/app-bundle-v2.js', 'w', encoding='utf-8') as f:
        f.write(content)

    with open('nmimsgdg-main/assets/app-bundle-v2.js', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Wrote patched bundles to assets/app-bundle-v2.js and nmimsgdg-main/assets/app-bundle-v2.js")

if __name__ == '__main__':
    apply_exact_patches()
