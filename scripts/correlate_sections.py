import os
from PIL import Image, ImageOps, ImageChops
import numpy as np

SECTIONS = [
    ("01_hero", "Hero & Navigation"),
    ("02_trust_strip", "Trust Strip"),
    ("03_about", "About LUMA"),
    ("04_clinical_tech", "Clinical Technology"),
    ("05_benefits", "Benefits Overview"),
    ("06_products", "Product Range"),
    ("07_quiz", "Assessment Quiz"),
    ("08_before_after", "Before & After"),
    ("09_faqs", "FAQs"),
    ("10_community", "LUMA Community"),
    ("11_experts", "Expert Testimonials"),
    ("12_guarantees", "Trust Guarantees"),
    ("13_footer", "Footer & Let's Connect"),
]

for sec_id, title in SECTIONS:
    p_path = f"psd_crops/{sec_id}.jpg"
    r_path = f"react_crops/{sec_id}.jpg"
    
    psd = Image.open(p_path).convert("L")
    react = Image.open(r_path).convert("L")
    
    # Resize react to match PSD dimensions for pixel correlation test
    react_matched = react.resize(psd.size, Image.Resampling.LANCZOS)
    
    # Calculate difference
    diff = ImageChops.difference(psd, react_matched)
    diff_arr = np.array(diff)
    
    mean_diff = np.mean(diff_arr)
    # Correlation / SSIM approximation
    p_norm = (np.array(psd, dtype=float) - np.mean(psd)) / (np.std(psd) + 1e-6)
    r_norm = (np.array(react_matched, dtype=float) - np.mean(react_matched)) / (np.std(react_matched) + 1e-6)
    corr = np.mean(p_norm * r_norm)
    
    print(f"[{sec_id}] {title:22s} | Mean Diff: {mean_diff:5.1f}/255 | Corr: {corr:5.3f} | PSD: {psd.size} | React: {react.size}")
