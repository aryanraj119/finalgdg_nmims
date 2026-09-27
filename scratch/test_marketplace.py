import urllib.request

try:
    resp = urllib.request.urlopen("http://localhost:8080/marketplace")
    html = resp.read().decode('utf-8')
    print("Marketplace Status:", resp.status)
    print("HTML Length:", len(html))
    print("Has root div:", '<div id="root">' in html)
    print("Has ecommerce-ui script:", 'ecommerce-ui.js' in html)
    print("Has app bundle script:", 'app-bundle-v2.js' in html)
except Exception as e:
    print("Error:", e)
