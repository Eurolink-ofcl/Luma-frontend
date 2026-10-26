import os
import asyncio
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

SECTIONS = [
    ("01_hero", "#hero-wrapper"),
    ("02_trust_strip", "#trust-strip"),
    ("03_about", "#about"),
    ("04_clinical_tech", "#clinical-technology"),
    ("05_benefits", "#benefits"),
    ("06_products", "#products"),
    ("07_quiz", "#assessment"),
    ("08_before_after", "#reviews"),
    ("09_faqs", "#faqs"),
    ("10_community", "#community"),
    ("11_experts", "#experts"),
    ("12_guarantees", "#guarantees"),
    ("13_footer", "#footer"),
]

os.makedirs("react_crops", exist_ok=True)
os.makedirs("compare_crops", exist_ok=True)

async def capture_sections():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # 1920x1080 viewport with device_scale_factor=1 for 1:1 pixel rendering matching 1920px PSD crops
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1
        )
        page = await context.new_page()
        print("Navigating to http://localhost:4173 ...")
        await page.goto("http://localhost:4173", wait_until="networkidle")
        await page.evaluate("() => document.fonts.ready")
        await page.wait_for_timeout(1000)

        for name, selector in SECTIONS:
            elem = page.locator(selector).first
            count = await elem.count()
            if count == 0:
                print(f"Warning: selector {selector} not found for {name}!")
                continue
            
            # Scroll element into view smoothly so any lazy-load / visibility stabilizes
            await elem.scroll_into_view_if_needed()
            await page.wait_for_timeout(300)
            
            out_path = f"react_crops/{name}.jpg"
            await elem.screenshot(path=out_path, type="jpeg", quality=90)
            print(f"Captured {name} from {selector} -> {out_path}")

        await browser.close()

def build_comparisons():
    print("\nGenerating side-by-side comparison images...")
    for name, selector in SECTIONS:
        psd_path = f"psd_crops/{name}.jpg"
        react_path = f"react_crops/{name}.jpg"
        out_path = f"compare_crops/{name}_compare.jpg"

        if not os.path.exists(psd_path) or not os.path.exists(react_path):
            print(f"Skipping {name}: missing {psd_path} or {react_path}")
            continue

        psd_img = Image.open(psd_path).convert("RGB")
        react_img = Image.open(react_path).convert("RGB")

        # Widths are both 1920.
        # Height can differ slightly. We match height or pad.
        psd_w, psd_h = psd_img.size
        r_w, r_h = react_img.size

        # Rescale react if width is slightly different
        if r_w != psd_w:
            react_img = react_img.resize((psd_w, int(r_h * (psd_w / r_w))), Image.Resampling.LANCZOS)
            r_w, r_h = react_img.size

        max_h = max(psd_h, r_h)
        header_h = 60
        canvas_w = psd_w + r_w + 20 # 20px gap
        canvas_h = max_h + header_h

        canvas = Image.new("RGB", (canvas_w, canvas_h), (20, 20, 20))
        draw = ImageDraw.Draw(canvas)

        # Header titles
        # Draw labels
        draw.rectangle([0, 0, canvas_w, header_h], fill=(30, 30, 30))
        draw.text((30, 18), f"PSD ORIGINAL: {name.upper()} (Canvas 1920w)", fill=(255, 200, 50))
        draw.text((psd_w + 40, 18), f"REACT IMPLEMENTATION: {name.upper()} (1920w)", fill=(50, 220, 120))

        # Paste images
        canvas.paste(psd_img, (0, header_h))
        canvas.paste(react_img, (psd_w + 20, header_h))

        canvas.save(out_path, quality=85)
        print(f"Saved side-by-side comparison: {out_path} ({canvas_w}x{canvas_h})")

if __name__ == "__main__":
    asyncio.run(capture_sections())
    build_comparisons()
    print("Done section captures and comparisons!")
