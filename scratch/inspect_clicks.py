with open('assets/index-CxpCrW08.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Find all occurrences of "Buy" with surrounding 120 chars
matches = []
for m in re.finditer(r'onClick:[^}]+Buy[^}]+}', content):
    matches.append(m.group(0))

print(f"Found {len(matches)} onClick matches with Buy:")
for i, m in enumerate(matches):
    print(f"Match {i}: {repr(m)}")
