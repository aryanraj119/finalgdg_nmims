with open('assets/index-CxpCrW08.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Find occurrences of the word "Buy"
pos = 0
while True:
    idx = content.find('Buy', pos)
    if idx == -1:
        break
    start = max(0, idx - 80)
    end = min(len(content), idx + 80)
    snippet = content[start:end].replace('\n', ' ')
    print(f"[{idx}]: {snippet}")
    pos = idx + 3
