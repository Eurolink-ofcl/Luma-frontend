import os
from PIL import Image, ImageChops, ImageStat
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

for sec in SECTIONS:
    psd_p = f"psd_crops/{sec}.jpg"
    react_p = f"react_crops/{sec}.jpg"
    
    psd = Image.open(psd_p).convert("RGB")
    react = Image.open(react_p).convert("RGB")
    
    pw, ph = psd.size
    rw, rh = react.size
    
    print(f"\n==================== SECTION: {sec} ====================")
    print(f"PSD size:   {pw} x {ph}")
    print(f"React size: {rw} x {rh} (Delta height: {rh - ph}px)")
    
    # Analyze horizontal padding / bounding box of content
    # Find active non-background bounding boxes in horizontal slices
    # Let's inspect center vertical stripe (x from 800 to 1120) vs outer edges (x from 0 to 200, 1720 to 1920)
    p_arr = np.array(psd)
    r_arr = np.array(react)
    
    print(f"PSD Center Mean RGB:   {np.mean(p_arr[:, 800:1120, :], axis=(0,1)).round(1).tolist()}")
    print(f"React Center Mean RGB: {np.mean(r_arr[:, 800:1120, :], axis=(0,1)).round(1).tolist()}")
    print(f"PSD Left Edge RGB:     {np.mean(p_arr[:, 0:150, :], axis=(0,1)).round(1).tolist()}")
    print(f"React Left Edge RGB:   {np.mean(r_arr[:, 0:150, :], axis=(0,1)).round(1).tolist()}")
