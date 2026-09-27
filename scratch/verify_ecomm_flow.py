import urllib.request
import json

print("1. Testing Marketplace Response...")
resp_mkt = urllib.request.urlopen("http://localhost:8080/marketplace")
print("Marketplace Status:", resp_mkt.status)

print("\n2. Testing Backend Database Seed Data...")
req = urllib.request.Request("http://localhost:8000/api/products?limit=25")
try:
    resp_prod = urllib.request.urlopen(req)
    data = json.loads(resp_prod.read().decode('utf-8'))
    print(f"Backend has {len(data)} active products loaded in SQLite database.")
    for p in data[:5]:
        print(f" - [{p['id']}] {p['name']} | Price: Rs.{p['price']} | Image: {p['image_url'][:60]}...")
except Exception as e:
    print("Backend API Error:", e)

print("\n3. Testing Shopping Bag Page...")
resp_bag = urllib.request.urlopen("http://localhost:8080/shopping-bag.html")
print("Shopping Bag Status:", resp_bag.status)
print("Contains dynamically rendered cart container:", "bag-items-container" in resp_bag.read().decode('utf-8'))
