import os, json
from PIL import Image

# Let's inspect the PSD typography analysis file to check exact font sizes and colors for each section
with open("psd_typography_analysis.json") as f:
    psd_typo = json.load(f)

print(f"Loaded {len(psd_typo)} text layers from psd_typography_analysis.json")

# Sample text layers by group
groups = {}
for item in psd_typo:
    # Determine which group or section it belongs to based on Y coordinate
    y = item['bbox'][1]
    sec = None
    if y < 2031:
        sec = "01_hero"
    elif y < 2196:
        sec = "02_trust_strip"
    elif y < 3269:
        sec = "03_about"
    elif y < 5700:
        sec = "04_clinical_tech"
    elif y < 8665:
        sec = "05_benefits"
    elif y < 10738:
        sec = "06_products"
    elif y < 12975:
        sec = "07_quiz"
    elif y < 14727:
        sec = "08_before_after"
    elif y < 16585:
        sec = "09_faqs"
    elif y < 17690:
        sec = "10_community"
    elif y < 19266:
        sec = "11_experts"
    elif y < 19968:
        sec = "12_guarantees"
    else:
        sec = "13_footer"
    
    if sec not in groups:
        groups[sec] = []
    groups[sec].append(item)

for sec, items in sorted(groups.items()):
    print(f"\nSection {sec} has {len(items)} text layers in PSD:")
    for it in items[:6]:
        txt = it['text'].replace('\n', ' ')[:40]
        f_name = it.get('font_name', 'Unknown')
        f_size = it.get('font_size_px', 0)
        color = it.get('color_hex', '#???')
        print(f"   [{color}] {f_size:.1f}px ({f_name}): {txt}")
