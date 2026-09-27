with open('assets/index-CxpCrW08.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Find everything between 505000 and 508100
chunk1 = content[505000:508100]
with open('scratch/chunk1.txt', 'w', encoding='utf-8') as out:
    out.write(chunk1)

# Find where 'Transaction Mechanism' is
idx2 = content.find('Transaction Mechanism')
if idx2 != -1:
    chunk2 = content[max(0, idx2-3000):idx2+500]
    with open('scratch/chunk2.txt', 'w', encoding='utf-8') as out:
        out.write(chunk2)

print("Saved chunk1 and chunk2 to scratch directory.")
