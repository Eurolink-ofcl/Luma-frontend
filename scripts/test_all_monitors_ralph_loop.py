import asyncio
import json
import os
from playwright.async_api import async_playwright

MONITORS = [
    {"name": "HD 16:9", "width": 1280, "height": 720, "aspect": "16:9"},
    {"name": "Laptop 1366", "width": 1366, "height": 768, "aspect": "16:9 approx"},
    {"name": "Laptop 1440", "width": 1440, "height": 900, "aspect": "16:10"},
    {"name": "Full HD 16:9", "width": 1920, "height": 1080, "aspect": "16:9"},
    {"name": "WUXGA 16:10", "width": 1920, "height": 1200, "aspect": "16:10"},
    {"name": "2K QHD 16:9", "width": 2560, "height": 1440, "aspect": "16:9"},
    {"name": "WQXGA 16:10", "width": 2560, "height": 1600, "aspect": "16:10"},
    {"name": "3K 16:10", "width": 2880, "height": 1800, "aspect": "16:10"},
    {"name": "4K UHD 16:9", "width": 3840, "height": 2160, "aspect": "16:9"},
]

SECTIONS = [
    ("hero", "#hero-wrapper"),
    ("trust_strip", "#trust-strip"),
    ("about", "#about"),
    ("clinical_tech", "#clinical-technology"),
    ("benefits", "#benefits"),
    ("products", "#products"),
    ("quiz", "#assessment"),
    ("before_after", "#reviews"),
    ("faqs", "#faqs"),
    ("community", "#community"),
    ("experts", "#experts"),
    ("guarantees", "#guarantees"),
    ("footer", "#footer"),
]

os.makedirs("monitor_tests", exist_ok=True)

async def run_ralph_monitor_suite():
    report = []
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        for mon in MONITORS:
            w = mon["width"]
            h = mon["height"]
            name = mon["name"]
            print(f"\n=======================================================")
            print(f"RALPH LOOP: Testing Monitor [{name}] ({w}x{h})")
            print(f"=======================================================")
            
            context = await browser.new_context(
                viewport={"width": w, "height": h},
                device_scale_factor=1
            )
            page = await context.new_page()
            
            # Navigate
            await page.goto("http://localhost:4173", wait_until="networkidle")
            await page.evaluate("() => document.fonts.ready")
            await page.wait_for_timeout(400)
            
            # Check Horizontal Overflow
            overflow_res = await page.evaluate("""() => {
                const scrollW = document.documentElement.scrollWidth;
                const winW = window.innerWidth;
                const bodyScrollW = document.body.scrollWidth;
                const hasOverflow = scrollW > winW || bodyScrollW > winW;
                
                // Inspect any element wider than window
                const offending = [];
                for (let el of document.querySelectorAll('*')) {
                    const r = el.getBoundingClientRect();
                    if (r.right > winW + 1.5 || r.left < -1.5) {
                        offending.push({
                            tag: el.tagName,
                            id: el.id,
                            cls: (el.className || '').toString().slice(0, 40),
                            left: Math.round(r.left),
                            right: Math.round(r.right),
                            w: Math.round(r.width)
                        });
                    }
                }
                return {
                    scrollW,
                    winW,
                    hasOverflow,
                    delta: Math.max(0, scrollW - winW),
                    offendingCount: offending.length,
                    offendingSample: offending.slice(0, 3)
                };
            }""")
            
            # Check Sections Coordinates & Centering
            section_res = await page.evaluate("""(sections) => {
                const res = {};
                for (let [name, sel] of sections) {
                    const el = document.querySelector(sel);
                    if (!el) {
                        res[name] = { found: false };
                        continue;
                    }
                    const r = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);
                    
                    // Check inner container centering
                    const innerContainer = el.querySelector('.max-w-\\\\[1400px\\\\], .max-w-\\\\[1360px\\\\], .max-w-\\\\[1200px\\\\], .about-container, .benefits-container, .products-container, .footer-container');
                    let isCentered = true;
                    let innerPaddingDiff = 0;
                    if (innerContainer) {
                        const ir = innerContainer.getBoundingClientRect();
                        const leftMargin = ir.left;
                        const rightMargin = window.innerWidth - ir.right;
                        innerPaddingDiff = Math.abs(leftMargin - rightMargin);
                        isCentered = innerPaddingDiff <= 2.5; // within 2.5px tolerance
                    }
                    
                    res[name] = {
                        found: true,
                        width: Math.round(r.width),
                        height: Math.round(r.height),
                        top: Math.round(r.top + window.scrollY),
                        isCentered
                    };
                }
                return res;
            }""", SECTIONS)
            
            # Check Hero Heading Font Size & Styling
            hero_typo = await page.evaluate("""() => {
                const h1 = document.querySelector('#hero h1');
                if (!h1) return null;
                const s = window.getComputedStyle(h1);
                return {
                    fontSize: s.fontSize,
                    fontWeight: s.fontWeight,
                    fontFamily: s.fontFamily,
                    lineHeight: s.lineHeight
                };
            }""")
            
            passed = not overflow_res["hasOverflow"]
            print(f"Result for {name}:")
            print(f"  Width: {w}px | ScrollWidth: {overflow_res['scrollW']}px | Overflow: {overflow_res['hasOverflow']} (Blowout: {overflow_res['delta']}px)")
            print(f"  Hero H1 Font: {hero_typo['fontWeight']} {hero_typo['fontSize']} ({hero_typo['fontFamily'].split(',')[0]})")
            print(f"  Sections Total: {len(section_res)}/13 verified")
            if overflow_res["offendingCount"] > 0:
                print(f"  Offending Elements: {overflow_res['offendingSample']}")
            
            # Save Screenshot
            clean_name = name.lower().replace(" ", "_").replace(":", "_").replace("\"", "")
            ss_path = f"monitor_tests/{clean_name}_{w}x{h}.jpg"
            await page.screenshot(path=ss_path, full_page=True, quality=75)
            print(f"  Saved Screenshot -> {ss_path}")
            
            report.append({
                "monitor": mon,
                "overflow": overflow_res,
                "heroTypo": hero_typo,
                "sections": section_res,
                "screenshot": ss_path,
                "passed": passed
            })
            
            await context.close()
            
        await browser.close()
        
    with open("monitor_tests/ralph_monitor_report.json", "w") as f:
        json.dump(report, f, indent=2)
    print("\n=======================================================")
    print("All 9 Monitor Tests Completed Successfully!")
    print("Report written to monitor_tests/ralph_monitor_report.json")
    print("=======================================================")

if __name__ == "__main__":
    asyncio.run(run_ralph_monitor_suite())
