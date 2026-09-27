with open("c:/Users/ANANYA SINGH/ikeaaa/assets/app-bundle-v2.js", "r", encoding="utf-8") as f:
    content = f.read()

pos = content.find('xl bg-[#0058A3] hover:bg-blue-800 text-white text-[11px]')
print(content[pos-250:pos+350].encode('ascii', 'replace').decode('ascii'))
