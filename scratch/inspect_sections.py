with open('assets/index-CxpCrW08.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx1 = content.find('Marketplace Checkout')
if idx1 != -1:
    print("Found 'Marketplace Checkout' at", idx1)
    print("Preceding 300 chars:", repr(content[idx1-300:idx1]))
    print("Succeeding 300 chars:", repr(content[idx1:idx1+300]))

idx2 = content.find('Transaction Mechanism')
if idx2 != -1:
    print("\nFound 'Transaction Mechanism' at", idx2)
    print("Preceding 300 chars:", repr(content[idx2-300:idx2]))
    print("Succeeding 300 chars:", repr(content[idx2:idx2+300]))
