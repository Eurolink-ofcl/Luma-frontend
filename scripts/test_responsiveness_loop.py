import asyncio
import json
import os
from playwright.async_api import async_playwright

VIEWPORTS = [
    {"name": "Mobile (iPhone)", "width": 390, "height": 844},
    {"name": "Tablet (iPad)", "width": 768, "height": 1024},
    {"name": "Laptop (MacBook 14\")", "width": 1440, "height": 900},
    {"name": "Full HD (1080p)", "width": 1920, "height": 1080},
    {"name": "2K QHD (1440p)", "width": 2560, "height": 1440},
]

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

os.makedirs("responsive_tests", exist_ok=True)

async def test_responsiveness():
    results = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        for vp in VIEWPORTS:
            print(f"\n=======================================================")
            print(f"Testing Viewport: {vp['name']} ({vp['width']}x{vp['height']})")
            print(f"=======================================================")
            
            context = await browser.new_context(
                viewport={"width": vp["width"], "height": vp["height"]},
                device_scale_factor=1
            )
            page = await context.new_page()
            
            # Listen for failed requests or console errors
            errors = []
            page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
            
            await page.goto("http://localhost:4173", wait_until="networkidle")
            await page.evaluate("() => document.fonts.ready")
            await page.wait_for_timeout(500)
            
            # Check horizontal overflow on document
            overflow_info = await page.evaluate("""() => {
                const docWidth = document.documentElement.offsetWidth;
                const scrollWidth = document.documentElement.scrollWidth;
                const winWidth = window.innerWidth;
                const hasHScroll = scrollWidth > winWidth;
                
                // Find any elements sticking out beyond viewport
                const overflowing = [];
                const all = document.querySelectorAll('*');
                for (let el of all) {
                    const rect = el.getBoundingClientRect();
                    if (rect.right > winWidth + 1 || rect.left < -1) {
                        overflowing.push({
                            tag: el.tagName,
                            id: el.id,
                            className: (el.className || '').toString().slice(0, 50),
                            left: Math.round(rect.left),
                            right: Math.round(rect.right),
                            width: Math.round(rect.width)
                        });
                    }
                }
                return {
                    docWidth,
                    scrollWidth,
                    winWidth,
                    hasHScroll,
                    overflowCount: overflowing.length,
                    overflowSample: overflowing.slice(0, 5)
                };
            }""")
            
            print(f"Viewport Width: {vp['width']} | Scroll Width: {overflow_info['scrollWidth']} | Has H-Overflow: {overflow_info['hasHScroll']}")
            if overflow_info['hasHScroll']:
                print(f"WARNING: Overflow elements detected: {overflow_info['overflowSample']}")
            
            # Test each section
            section_status = {}
            for sec_name, selector in SECTIONS:
                sec_info = await page.evaluate(f"""(sel) => {{
                    const el = document.querySelector(sel);
                    if (!el) return {{ found: false }};
                    const rect = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);
                    
                    // Check font of first heading inside section
                    const heading = el.querySelector('h1, h2, h3, p');
                    const headingStyle = heading ? window.getComputedStyle(heading) : null;
                    
                    return {{
                        found: true,
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                        top: Math.round(rect.top + window.scrollY),
                        fontFamily: headingStyle ? headingStyle.fontFamily : style.fontFamily,
                        fontSize: headingStyle ? headingStyle.fontSize : null,
                        fontWeight: headingStyle ? headingStyle.fontWeight : null
                    }};
                }}""", selector)
                
                section_status[sec_name] = sec_info
                print(f"  {sec_name:18s} | size: {sec_info.get('width', 0)}x{sec_info.get('height', 0)} | font: {sec_info.get('fontWeight')} {sec_info.get('fontSize')} ({sec_info.get('fontFamily')})")
            
            # Capture screenshot
            ss_path = f"responsive_tests/{vp['width']}_{vp['name'].split()[0].lower()}.jpg"
            await page.screenshot(path=ss_path, full_page=True, quality=80)
            print(f"Captured full page screenshot: {ss_path}")
            
            results[vp['name']] = {
                "viewport": vp,
                "overflow": overflow_info,
                "sections": section_status,
                "consoleErrors": errors
            }
            await context.close()
            
        await browser.close()
        
    with open("responsive_tests/results.json", "w") as f:
        json.dump(results, f, indent=2)
    print("\nSaved comprehensive responsive report to responsive_tests/results.json")

if __name__ == "__main__":
    asyncio.run(test_responsiveness())
