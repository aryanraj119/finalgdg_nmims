with open('assets/index-CxpCrW08.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Find all occurrences of Buy
for idx in [m.start() for m in re.finditer(r'Buy', content)]:
    start = max(0, idx - 100)
    end = min(len(content), idx + 100)
    chunk = content[start:end]
    # Check if there is a button or onClick near here
    if 'button' in chunk or 'onClick' in chunk or 'cursor-pointer' in chunk:
        with open('scratch/found_buy_button.txt', 'a', encoding='utf-8') as out:
            out.write(f"\n--- POS {idx} ---\n")
            out.write(content[max(0, idx - 200):min(len(content), idx + 200)])

print("Done scanning buy buttons")
