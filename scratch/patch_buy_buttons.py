import re

def patch_bundle(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_len = len(content)
    
    # 1. Patch Marketplace Buy button
    # Pattern: onClick:$=>{$.stopPropagation(),v(X),N(null)}
    # or similar where v(X) is setCheckoutItem(item)
    # We want: onClick:$=>{$.stopPropagation();window.location.href='/checkout.html?productId='+X.id}
    content = re.sub(
        r'onClick:\s*([a-zA-Z0-9_$]+)\s*=>\s*\{\s*\1\.stopPropagation\(\)\s*,\s*([a-zA-Z0-9_$]+)\(([a-zA-Z0-9_$]+)\)\s*,\s*([a-zA-Z0-9_$]+)\(null\)\s*\}',
        r"onClick:\1=>{\1.stopPropagation(),window.location.href='/checkout.html?productId='+\3.id}",
        content
    )

    # 2. Patch SecondHandFurniture product card Buy button
    # Pattern: onClick:Pe=>{Pe.stopPropagation(),Y(te)}
    content = re.sub(
        r'onClick:\s*([a-zA-Z0-9_$]+)\s*=>\s*\{\s*\1\.stopPropagation\(\)\s*,\s*([a-zA-Z0-9_$]+)\(([a-zA-Z0-9_$]+)\)\s*\}\s*,\s*className:\s*"flex-1[^"]*"\s*,\s*children:\s*"[^"]*Buy"',
        r"onClick:\1=>{\1.stopPropagation(),window.location.href='/checkout.html?productId=sh-00'+\3.id},className:\"flex-1 py-1.5 rounded-xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-[11px] shadow-sm transition-all cursor-pointer\",children:\"Buy Now\"",
        content
    )

    # 3. Patch SecondHandFurniture details drawer Buy button
    # Pattern: onClick:()=>{Y(J),fe(null)} ... children:"[ BUY NOW ]"
    content = re.sub(
        r'onClick:\s*\(\)\s*=>\s*\{\s*([a-zA-Z0-9_$]+)\(([a-zA-Z0-9_$]+)\)\s*,\s*([a-zA-Z0-9_$]+)\(null\)\s*\}\s*,\s*className:\s*"[^"]*"\s*,\s*children:\s*"\[ BUY NOW \]"\s*\}',
        r"onClick:()=>{window.location.href='/checkout.html?productId=sh-00'+\2.id},className:\"py-3 px-4 rounded-2xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 cursor-pointer\",children:\"Buy Now\"}",
        content
    )

    # Also replace any emoji in Buy buttons
    content = content.replace('🛒 Buy', 'Buy Now')
    content = content.replace('[ BUY NOW ]', 'Buy Now')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Patched {filepath}: before {original_len}, after {len(content)}")

if __name__ == '__main__':
    patch_bundle('assets/app-bundle-v2.js')
    patch_bundle('nmimsgdg-main/assets/app-bundle-v2.js')
