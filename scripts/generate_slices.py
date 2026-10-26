import os
from PIL import Image

# Function to inspect specific key crops by creating high-res comparative slices
def inspect_slice(sec, y_start_pct, y_end_pct):
    p_img = Image.open(f"psd_crops/{sec}.jpg")
    r_img = Image.open(f"react_crops/{sec}.jpg")
    
    pw, ph = p_img.size
    rw, rh = r_img.size
    
    p_crop = p_img.crop((0, int(ph * y_start_pct), pw, int(ph * y_end_pct)))
    r_crop = r_img.crop((0, int(rh * y_start_pct), rw, int(rh * y_end_pct)))
    
    # Save a slice comparison
    sw = pw + rw
    sh = max(p_crop.size[1], r_crop.size[1])
    slice_img = Image.new("RGB", (sw, sh), (0, 0, 0))
    slice_img.paste(p_crop, (0, 0))
    slice_img.paste(r_crop, (pw, 0))
    os.makedirs("slices", exist_ok=True)
    out_p = f"slices/{sec}_slice_{int(y_start_pct*100)}_{int(y_end_pct*100)}.jpg"
    slice_img.save(out_p)
    print(f"Saved slice {out_p}")

for s in ["02_trust_strip", "10_community", "11_experts", "12_guarantees"]:
    inspect_slice(s, 0.1, 0.9)
