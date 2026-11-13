# LUMA — Tester & Quality Assurance (QA) Guide

Welcome to the **LUMA Phototherapy & Health Technologies** testing guide! 

This document is designed for anyone testing the website. You do **not** need any coding knowledge to use this guide. Everything is written in plain, clear language so you can explore the site, test every feature, verify that all content matches the original Photoshop (PSD) designs, and ensure all text/media can be edited effortlessly through the Admin CMS.

---

## 1. What is the LUMA Project?

**LUMA** is a luxury health-technology and e-commerce brand that creates **clinical-grade light therapy devices** (such as LED face masks, handheld recovery panels, and full-body phototherapy systems). 

The platform has two main sides:
1. **The Public Storefront (For Customers):**
   - Customers visit the site to learn about light therapy, browse clinical devices, read verified customer stories, purchase products, track their orders, cancel orders before shipping, request returns within 7 days, and leave reviews.
2. **The Admin Console (For Company Staff & Admins):**
   - Company staff log into `/admin` to manage the product catalog, fulfill orders, approve or refund customer return requests, review customer ratings, and dynamically update all website text, banners, and meeting links via the CMS without touching code.

---

## 2. Testing Environments & Links

| Platform | Live Website Link |
| :--- | :--- |
| **Live Storefront (Customer)** | [https://luma-seven-vert.vercel.app](https://luma-seven-vert.vercel.app) |
| **Customer Reviews Page** | [https://luma-seven-vert.vercel.app/reviews](https://luma-seven-vert.vercel.app/reviews) |
| **Customer Account Portal** | [https://luma-seven-vert.vercel.app/account](https://luma-seven-vert.vercel.app/account) |
| **Admin Console** | [https://luma-seven-vert.vercel.app/admin](https://luma-seven-vert.vercel.app/admin) |

> **Best Browsers for Testing:** Google Chrome, Safari, and Microsoft Edge. Also test on your mobile phone!

---

## 3. General Visual, Design & Alignment Checklist

Before testing buttons and forms, check how the pages **look and feel**:

### A. Colors & Visual Identity
- [ ] **LUMA Signature Red (`#ED2124`):** Check that buy buttons, active tabs, and primary highlights use this bold, bright red.
- [ ] **Backgrounds:** Hero sections and headers should be crisp `#0A0A0B` (dark/black) or clean `#FFFFFF` (white) with no awkward grey smudges.
- [ ] **Typography:** Text must look crisp, modern, and readable with consistent fonts.

### B. Layout & Alignment
- [ ] **No Overlapping Text:** Text should never overlap other words, buttons, or images.
- [ ] **Centered Elements:** Section headings (like `REAL STORY` or `OUR PRODUCTS`) should be neatly centered with their red accent pill bar directly beneath.
- [ ] **Spacers & Padding:** Spacing between sections should feel clean and balanced—not too cramped and not giant empty white gaps.
- [ ] **Horizontal Scrolling:** On mobile or desktop, check that the entire webpage does not wobble or scroll horizontally off the screen.

### C. Content & Language
- [ ] **No Placeholder Text:** Make sure you do not see placeholder text like `"Lorem Ipsum"`, `"test test"`, or `"undefined"`.
- [ ] **No Broken Characters:** Check that there are no weird encoding symbols like `â€`, `Â©`, or strange question mark boxes.
- [ ] **Prices & Currencies:** Check that prices are formatted cleanly (e.g. `$326` or `1,200 AED`).

---

## 4. Customer Journey Testing (Step-by-Step)

Follow these scenarios as if you are a real customer shopping on the website:

### Test 1: Browsing the Store & Product Pages
1. Open the **Homepage** and scroll down through the **"Find Your Device"** carousel.
   - [ ] Do product images look sharp and attractive?
   - [ ] Do product cards have clear titles, prices, and "Buy Now" buttons?
2. Click on a product (e.g., **LIGHT THERAPY MASK** or **LUMA GLOW**).
3. On the **Product Detail Page**, check the page from top to bottom:
   - [ ] **Top Hero Area:** Main photo gallery on the left, Title, Price, and "Add to Cart" / "Buy Now" buttons on the right.
   - [ ] **The 5 Accordion Drawers** (located under the buy button): Click to expand each drawer:
     - `1. Product Specification`
     - `2. Health Benefits`
     - `3. The 4 Wavelengths`
     - `4. How to Use`
     - `5. What's in the Box`
     *(Ensure each drawer opens smoothly and displays clear text).*
   - [ ] **Section 2 (Mid-Page):** Check the 3 visual Clinical Benefit Cards (clean layout, titles, descriptions, and icons).
   - [ ] **Section 3 (Bottom):** Check the dark **Technical Specifications Table** (dimensions, optical power, treatment modes) next to the device render image.

---

### Test 2: Placing an Order (Checkout Flow)
1. Click **"Buy Now"** or **"Add to Cart"** and proceed to checkout.
2. Enter your test customer details (Name, Email, Delivery Address, Phone Number).
3. Complete the checkout using the test payment option.
4. **Verify:**
   - [ ] A success confirmation appears with an Order Number (e.g., `#LUM-194537`).
   - [ ] The order shows up under **Customer Account (`/account#orders`)**.

---

### Test 3: Canceling an Order Before Shipment
> **Business Rule:** Customers can cancel an order *only* while its status is **Confirmed** (before the warehouse marks it as "Shipped"). When canceled, a full automatic refund is triggered.

1. Go to your **Account Page** (`/account`).
2. Click the **"Ordered Products & Status"** tab.
3. Locate an order that has the status **`CONFIRMED`**.
4. Click the red **"Cancel Order"** button.
5. **Verify:**
   - [ ] The order status immediately changes to **`STATUS: CANCELLED`**.
   - [ ] A purple/violet refund banner appears stating: **"Automated Refund Initiated"** with a reversal reference ID and the timeline (3–7 business days).
   - [ ] You can no longer cancel it a second time.

---

### Test 4: 7-Day Product Return & Refund Request
> **Business Rule:** Customers can request a return within **1 week (7 days)** of receiving a delivered product. They must provide a reason. The return request is sent to the admin for review.

1. In the **Account Page**, find an order marked **`DELIVERED`**.
2. **Verify the Return Window:**
   - [ ] You should see a green badge: `● Return window active: 7 days remaining (1-week return policy)`.
3. Click the **"Request Return & Refund"** button.
4. An interactive return drawer or form will open:
   - Select your reason (e.g., "Device didn't fit", "Changed mind", "Defective unit") or type your custom reason.
   - Click **"Submit Return Request"**.
5. **Verify:**
   - [ ] The status badge updates to **`Return Requested (Pending Admin Review)`**.
   - [ ] A message tells you that the admin team will inspect the reason and process the refund.

---

### Test 5: Leaving a Review for a Delivered Order
> **Business Rule:** Only customers who have actually purchased and received an item (`DELIVERED`) can leave a star rating and review. Each product gets only one review form.

1. On a **`DELIVERED`** order in your account, look for the review box:
   - Header: `"★ How was your experience with this device?"`
2. Click **"Write a Review"**.
3. Select your Star Rating (1 to 5 stars) and write your review message (e.g., *"My skin feels firmer after 2 weeks!"*).
4. Click **"Submit My Review"**.
5. **Verify:**
   - [ ] The form submits cleanly.
   - [ ] The review card now shows your submitted stars, quote, and a clean **`✓ Review Submitted`** badge.
   - [ ] It does **not** show multiple duplicate "Write a review" forms.

---

### Test 6: "Real Story" Gallery & Share Story Submission
1. Navigate to the **Reviews Page** (`/reviews`).
2. Scroll to the **"REAL STORY"** section:
   - [ ] **Visual Check:** Verify the curved 3D panoramic layout matching the Photoshop design with 8 distinct device cards.
   - [ ] **Interactive Check:** Click on any card (e.g., Card 1 or Card 2). A popup modal should open displaying the high-resolution photo or video player, author badge, stars, and review text.
   - [ ] **Dots & Navigation:** Test clicking the 4 pagination dots at the bottom.
3. Scroll down to the **"SHARE YOUR STORY"** section at the bottom of the reviews page:
   - [ ] Fill in your Name, select a Product, write a Story, and click the image upload icon to choose a photo from your computer/phone.
   - [ ] Check the consent checkbox: *"I agree LUMA may share my story..."*.
   - [ ] Click **"Send MY Story"**.
   - [ ] A green confirmation should appear: *"Thank you for sharing your story! Our team will review and feature it."*

---

## 5. Admin Console Testing (For Store Administrators)

Log into the **Admin Portal** at `/admin`:

### Test A: Orders Management
1. In the left sidebar, click **"Orders"**.
2. **Tab Filters:** Click through `All Orders`, `Confirmed`, `Shipped`, `Delivered`, `Returned & Refunded`, and `Cancelled`.
   - [ ] Verify each tab filters the list correctly.
   - [ ] Verify the pagination (e.g. Previous / Next) works smoothly if there are many orders.
3. **One-Way Order Progression Action:**
   - On a `Confirmed` order, click **"Mark as Shipped"** → verify status updates to `Shipped`.
   - On a `Shipped` order, click **"Mark as Delivered"** → verify status updates to `Delivered`.
   - On an order that was canceled or returned, verify the button shows **"Locked (Final State)"**.
4. **Reviewing Customer Return Requests:**
   - Find an order where the customer submitted a 7-day return request.
   - You should see the customer's return reason clearly highlighted.
   - As an admin, test clicking **"Approve Return & Issue Refund"**.
   - [ ] The status must update to **`RETURNED & REFUNDED`** (and not just stay as "Delivered").

---

### Test B: Products Manager & CMS Reordering
1. In the left sidebar, click **"Products"**.
2. Click **"Edit"** on any product (e.g., **MASK**).
3. **Verify the 6 Form Tabs follow the live frontend page from top to bottom:**
   - **Tab 1: `1. Hero — Info & Pricing`** (Product Name, URL Slug, Category, Pricing, Stock).
   - **Tab 2: `2. Hero — Images & Media`** (Main showcase photos and hero gallery).
   - **Tab 3: `3. Hero — Accordion Drawers`** (The 5 expandable drawers under the buy button: Spec highlights, Health benefits, 4 Wavelengths, How to use, What's in the box).
   - **Tab 4: `4. Section 2 — 3 Benefit Cards`** (The 3 mid-page clinical benefit cards).
   - **Tab 5: `5. Section 3 — Technical Specs`** (Dark table specifications and device render).
   - **Tab 6: `6. Storefront & Catalog`** (Display order 1..8, red eyebrow, card title lines, active toggle).
4. **Verification:**
   - [ ] Each tab has a helpful section banner at the top telling you which part of the website it controls.
   - [ ] There are **no duplicate accordion sections** at the bottom of the other tabs.
   - [ ] Edit a price or text, click **"Save Product"**, and verify the live product page updates!

---

### Test C: Reviews CMS & Customer Story Submissions
1. In the left sidebar, click **"Content Management"** → **"Reviews CMS"**.
2. Scroll to the **"Customer Story Submissions"** panel at the bottom:
   - [ ] Verify you can see stories submitted by users via the "Share Your Story" form.
   - [ ] Verify the uploaded photo thumbnail loads cleanly (no broken image icons).
   - [ ] Test the **"Approve Story"** and **"Feature"** buttons.
   - [ ] Once approved or featured, go to the live **Reviews Page (`/reviews`)** and verify that this story appears in the **`REAL STORY`** 3D gallery!

---

## 6. Complete CMS Content & Design Fidelity Audit (Page-by-Page)

The admin should be able to edit **all text and media** on every page. Use this audit to test that editing works and that the content matches the Photoshop designs:

### A. Homepage CMS (`/admin` → Site Content → Homepage Text)
- [ ] **Hero Section:** Test editing the Main Headline (e.g., `"CLINICAL-GRADE LIGHT THERAPY"`), Subtitle, and Call-to-Action button text. Save and verify on `/`.
- [ ] **Storefront Device Carousel:** In Products Manager (Tab 6), verify each product has its Display Order (1 to 8), Red Eyebrow (e.g. `LUMA GLOW`), and two Title Lines.
- [ ] **Science & Wavelength Section:** Verify the 4 wavelengths are explicitly documented:
  - `630nm` & `660nm` (Deep Red Light — Collagen & Skin Regeneration)
  - `810nm` & `850nm` (Near-Infrared Light — Deep Muscle & Cellular Recovery)
- [ ] **Clinical Irradiance:** Verify irradiance levels read `>100 mW/cm²` at surface with zero flicker and zero harmful UV.
- [ ] **Before & After Split Sliders:** Test dragging the interactive split slider left/right to compare before and after clinical skin results.

### B. About Page CMS (`/admin` → Site Content → About Page)
- [ ] **Hero Headline & Brand Story:** Verify the headline reads `"THE SCIENCE OF LIGHT"` and the brand story accurately explains LUMA's medical origins.
- [ ] **3 Clinical Pillars / Values:** Verify the 3 core pillars (e.g. Medical Engineering, Proven Wavelengths, Zero Compromise Safety) have editable titles and descriptions.
- [ ] **Medical Advisory Panel:** Verify doctor/specialist titles and photos can be edited via the CMS.
- [ ] **Save & Live Check:** Edit one sentence in About CMS, click **"Save Changes"**, and verify it reflects immediately on `https://luma-seven-vert.vercel.app/about`.

### C. Reviews Page CMS (`/admin` → Site Content → Reviews CMS)
- [ ] **Review Hero Banner:** Verify the rating headline (e.g., `"4.9/5 Overall Rating Based on 2,400+ Real Outcomes"`).
- [ ] **Real Stories Carousel:** Verify the customer quote cards can be updated or reordered.
- [ ] **Real Story 3D Gallery (Section 3):** Verify the title `"REAL STORY"` with its red underline pill bar. Check that approved customer stories appear here.
- [ ] **Real Sessions Before/After Comparison:** Check the 4 clinical concerns tabs: `ACNE`, `WRINKLE`, `TEXTURE`, `TONE`. Test editing the subtitles or photos for each category in the CMS.
- [ ] **"Share Your Story" Section Copy:** Verify the submission success message (`"Thank you for sharing your story!"`) is editable.

### D. Community Page CMS (`/admin` → Site Content → Community Page)
- [ ] **Community Hero Banner:** Verify title `"JOIN THE LIGHT REVOLUTION"` and member counter.
- [ ] **VIP Perks & Member Benefits:** Check that all 4 member benefit cards have clear descriptions.
- [ ] **Live Events & Webinars:**
  - Verify upcoming webinar titles, speaker names, dates, and times.
  - **Important:** Verify the **"Join Meeting"** / Zoom link can be updated in the CMS and opens the meeting in a new tab when clicked.
- [ ] **Ask a Question & Community FAQ:** Check that questions can be submitted and FAQs can be edited in the CMS.

### E. Products Manager (Catalog & Detail Pages)
- [ ] **Titles & Slugs:** Check that each product has a clean name (e.g. `LIGHT THERAPY MASK`) and URL slug (`mask` or `luma-glow`).
- [ ] **Hero Accordion Drawers (Tab 3):** Test editing a specification highlight or health benefit bullet point. Save and confirm it shows up inside the expanded drawer on the product page.
- [ ] **Benefit Cards (Tab 4):** Verify the 3 cards (`4 WAVELENGTHS`, `WIRELESS`, `2 MODES`) have correct descriptions and images.
- [ ] **Dark Technical Specs Table (Tab 5):** Verify table values (LED count, Lifespan 50,000 hrs, Timer 10 min Auto, 3-Year Warranty, Dimensions, Weight) are 100% accurate as per device specs.

---

## 7. How to Report an Issue (Bug Template)

If you spot something broken, misaligned, or confusing, please copy this quick format and share it with the team:

```markdown
### 🐛 Bug / Issue Report
- **Page URL:** (e.g. https://luma-seven-vert.vercel.app/reviews)
- **Device & Browser:** (e.g. iPhone 14 Safari, or Windows 11 Chrome)
- **Section / Component:** (e.g. REAL STORY 3D gallery, or Order Cancellation)
- **What Happened (Actual):** (e.g. "The thumbnail image was broken and showed an empty box.")
- **What Should Happen (Expected):** (e.g. "The uploaded photo should appear inside the card.")
- **Steps to Reproduce:**
  1. Open /account
  2. Click on 'Ordered Products & Status'
  3. Click 'Cancel Order'
- **Screenshot / Video:** (Attach an image or short clip)
```

---

*Thank you for testing the LUMA platform! Your feedback ensures our customers experience a world-class luxury phototherapy shopping journey.*
