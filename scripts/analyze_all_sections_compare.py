import os
from PIL import Image, ImageStat
import numpy as np

SECTIONS = [
    "01_hero",
    "02_trust_strip",
    "03_about",
    "04_clinical_tech",
    "05_benefits",
    "06_products",
    "07_quiz",
    "08_before_after",
    "09_faqs",
    "10_community",
    "11_experts",
    "12_guarantees",
    "13_footer",
]

print("="*60)
print("RALPH LOOP: SYSTEMATIC SECTION-BY-SECTION COMPARISON")
print("="*60)

for sec in SECTIONS:
    psd_p = f"psd_crops/{sec}.jpg"
    react_p = f"react_crops/{sec}.jpg"
    if not os.path.exists(psd_p) or not os.path.exists(react_p):
        print(f"Missing files for {sec}")
        continue
    
    psd_img = Image.open(psd_p).convert("RGB")
    react_img = Image.open(react_p).convert("RGB")
    
    pw, ph = psd_img.size
    rw, rh = react_img.size
    
    # Sample top 20px, middle 20px, bottom 20px background colors
    psd_arr = np.array(psd_img)
    react_arr = np.array(react_img)
    
    # Outer corners / margins background color check
    psd_bg_top = psd_arr[10, 10]
    psd_bg_mid = psd_arr[ph//2, 10]
    psd_bg_bot = psd_arr[-10, 10]
    
    react_bg_top = react_arr[10, 10]
    react_bg_mid = react_arr[rh//2, 10]
    react_bg_bot = react_arr[-10, 10]
    
    print(f"\n--- [{sec}] ---")
    print(f"Dimensions: PSD=({pw}x{ph}) vs React=({rw}x{rh}) (Height ratio: {rh/ph:.2f})")
    print(f"Background Top:  PSD RGB={psd_bg_top.tolist()} | React RGB={react_bg_top.tolist()}")
    print(f"Background Mid:  PSD RGB={psd_bg_mid.tolist()} | React RGB={react_bg_mid.tolist()}")
    print(f"Background Bot:  PSD RGB={psd_bg_bot.tolist()} | React RGB={react_bg_bot.tolist()}")
