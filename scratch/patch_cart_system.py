import re

def patch_bundle(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    print(f"Patching {file_path} (length: {len(content)})...")
    
    # 1. Patch Navbar Cart Click: Take user to /shopping-bag.html and show badge
    old_cart_click_pattern = r'onClick:\(\)=>t\(`Cart contains \$\{e\.length\} item\(s\)`\)'
    new_cart_click = 'onClick:()=>{window.location.href="http://localhost:8080/shopping-bag.html"}'
    
    if re.search(old_cart_click_pattern, content):
        content = re.sub(old_cart_click_pattern, new_cart_click, content)
        print("[OK] Patched Navbar Cart Click handler!")
    else:
        print("Note: Navbar Cart Click pattern not found or already patched.")

    # 2. Patch Marketplace Buy Button -> "Add to cart" in children
    content = content.replace('children:"Buy Now"', 'children:"Add to cart"')
    content = content.replace('children:"🛒 Buy"', 'children:"🛒 Add to cart"')
    content = content.replace('children:b.jsx("span",{children:"Buy Now"})', 'children:b.jsx("span",{children:"Add to cart"})')
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Saved {file_path} successfully!")

patch_bundle("c:/Users/ANANYA SINGH/ikeaaa/assets/app-bundle-v2.js")
