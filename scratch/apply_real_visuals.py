with open("c:/Users/ANANYA SINGH/ikeaaa/assets/app-bundle-v2.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Patch Marketplace Card image placeholder
target_img1 = 'b.jsx("div",{className:"w-24 h-24 rounded-2xl shadow-md border-2 border-white flex items-center justify-center",style:{backgroundColor:X.color||"#64748B"},children:b.jsx("span",{className:"text-white text-xs font-black uppercase text-center px-1",children:X.category})})'
repl_img1 = 'b.jsx("img",{src:window.getFurnitureImage?window.getFurnitureImage(X):"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",alt:X.name,className:"w-full h-full object-cover"})'

if target_img1 in content:
    content = content.replace(target_img1, repl_img1)
    print("Patched Marketplace card image!")
else:
    print("target_img1 not found")

# 2. Patch Secondhand details image placeholder
target_img2 = 'b.jsx("div",{className:"w-40 h-40 rounded-3xl shadow-xl flex items-center justify-center border-4 border-white",style:{backgroundColor:c.color||"#64748B"},children:b.jsx("span",{className:"text-white text-base font-black uppercase text-center",children:c.category})})'
repl_img2 = 'b.jsx("img",{src:window.getFurnitureImage?window.getFurnitureImage(c):"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",alt:c.name,className:"w-full h-full object-cover rounded-2xl"})'

if target_img2 in content:
    content = content.replace(target_img2, repl_img2)
    print("Patched Secondhand detail image!")
else:
    print("target_img2 not found")

# 3. Patch Marketplace button click handler to add to cart
target_btn1 = 'onClick:$=>{$.stopPropagation(),window.location.href="/checkout.html?productId="+X.id}'
repl_btn1 = 'onClick:$=>{$.stopPropagation();window.addToIkeaCart&&window.addToIkeaCart(X,$.currentTarget)}'

if target_btn1 in content:
    content = content.replace(target_btn1, repl_btn1)
    print("Patched Marketplace Add to Cart click handler!")
else:
    print("target_btn1 not found")

# 4. Patch Secondhand button click handler
target_btn2 = 'onClick:Pe=>{Pe.stopPropagation(),window.location.href="/checkout.html?productId=sh-00"+te.id}'
repl_btn2 = 'onClick:Pe=>{Pe.stopPropagation();window.addToIkeaCart&&window.addToIkeaCart(te,Pe.currentTarget)}'

if target_btn2 in content:
    content = content.replace(target_btn2, repl_btn2)
    print("Patched Secondhand Add to Cart click handler!")
else:
    print("target_btn2 not found")

# 5. Patch Drawer button click handler
target_btn3 = 'onClick:()=>{window.location.href="/checkout.html?productId=sh-00"+I.id}'
repl_btn3 = 'onClick:e=>{window.addToIkeaCart&&window.addToIkeaCart(I,e.currentTarget)}'

if target_btn3 in content:
    content = content.replace(target_btn3, repl_btn3)
    print("Patched Drawer Add to Cart click handler!")
else:
    print("target_btn3 not found")

with open("c:/Users/ANANYA SINGH/ikeaaa/assets/app-bundle-v2.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Saved patched bundle!")
