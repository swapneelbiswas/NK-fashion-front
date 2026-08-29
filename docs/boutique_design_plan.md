# Retail Boutique Storefront Design Plan (Inspired by Dheu.in)

This document details the visual analysis and the step-by-step design migration plan to transform the public storefront landing page into a luxury ethnic clothing boutique styled similarly to the `dheu.in` website.

---

## 1. Visual & Structural Design Analysis of Dheu.in

Dheu.in is an online fashion boutique specializing in traditional Indian ethnic wear (Sarees, Dhoti-Kurtas, and jewelry). Its website is built on Shopify using a customized version of the premium **Impulse** theme (v6.0.1). Below is the breakdown of its core styling and layout components:

### A. Color Palette
- **Primary Accent/Theme Color**: Deep Crimson/Maroon (`#700404`). This color represents Bengali tradition and gives the boutique its primary brand identity. It is used for announcement banners, primary headers, button fills, and key icons.
- **Secondary/Luxury Highlight Color**: Soft Gold/Ochre (`#C1A561` / `#6c5209`). This color represents luxury, matching the gold borders of ethnic garments. It is used for discount flags, star ratings, prices, active menu highlights, and hover text.
- **Background Tones**: Pure white (`#ffffff`) for page backgrounds, very light off-white/gray (`#f9fafb`) for grid sections, and light cream for subtle section blocks.
- **Typography Tone**: Dark Charcoal (`#1a1a1a` / `#333333`) for high contrast readability.

### B. Typography
- **Headings & Accents**: `"Tenor Sans"`, sans-serif. This is an elegant, geometric, slightly flared typeface which gives titles a boutique, editorial fashion-magazine feel.
- **Body & Interface Text**: `"Outfit"`, sans-serif. Used with a light font-weight (`300`) for paragraphs and description blocks, and semi-bold (`600`) for buttons, headings, and prices.

### C. Layout Elements
1. **Announcement Banner**: Solid maroon bar at the top of the viewport with gold text to convey ongoing promos and quick help links.
2. **Main Header**:
   - Clean, sticky layout with a high-resolution logo.
   - Centered main navigation menu (Saree, Dhoti-Kurta, Men, Kids, Couple Collection, Jewelry).
   - Right utility icons: Search, Customer Profile (where portal logins will reside), and Shopping Cart with numeric item badges.
3. **Hero Slider Carousel**: Full-screen width banner slides featuring ethnic modeling photography with elegant serif card overlays and borderless square call-to-action buttons.
4. **Collection Grid Blocks**: A mosaic layout showcasing key collections (e.g., Grooms, Silk Mark Certified, Bestsellers) using portrait ratio images, thin border divisions, and zoom-on-hover effects.
5. **Product Listing Grid**:
   - Multi-column grids (4-column desktop, 2-column mobile) of product cards.
   - Product Cards show a portrait image that switches to an alternate angle of the product on hover.
   - Text elements are kept clean and small: Brand label (gold/charcoal), title, star ratings, and prices.
6. **Interactive Slide-Out Cart Drawer**: Triggers when clicking the cart icon or adding an item. Slides out from the right side, showing added items, subtotal, and checkout options without interrupting the browse path.
7. **Boutique Footer**: Deep maroon footer with link columns, newsletter forms, shipping policy details, and payment vendor cards.

---

## 2. Implementation Action Plan

We will adapt these design elements directly into our Angular public landing page component and global styling layer.

### Phase 2.1: Loading Fonts & Setting Up Style Tokens
- **Google Fonts Import**: Load `Tenor Sans` and `Outfit` inside [index.html](file:///i:/swap/project%20template/angular%20frontend/src/index.html).
- **CSS Variable Definitions**: Add boutique custom tokens in [styles.scss](file:///i:/swap/project%20template/angular%20frontend/src/styles.scss):
  ```scss
  :root {
    --boutique-primary: #700404;      /* Deep Maroon */
    --boutique-accent: #C1A561;       /* Luxury Gold */
    --boutique-accent-dark: #6c5209;  /* Dark Ochre Gold */
    --boutique-bg-light: #f9fafb;     /* Very Light Gray */
    --boutique-text-dark: #1a1a1a;    /* Charcoal Text */
    --boutique-font-header: "Tenor Sans", serif;
    --boutique-font-base: "Outfit", sans-serif;
  }
  ```
- **Button Style Reset**: Reset button components to square corners (`border-radius: 0px`) and thin borders (`1px solid`).

### Phase 2.2: Redesigning the Landing Page Layout
Redesign the files in `src/app/pages/common/landing/`:
1. **Header & Navigation Bar**:
   - Left side: Logo.
   - Center: Menu navigation (Shop, Saree, Dhoti-Kurta, Couple Sets, Men, Kids).
   - Right side: Search, Cart Icon (with active badge), and Account Dropdown.
   - **Account Dropdown Portals**: To retain role login access, the Account dropdown will list:
     - `Customer Login` (routes to `/login/hospital-staff` or `/account`)
     - `POS Cashier Terminal` (routes to `/login/staff` or `/pos`)
     - `Store Manager Portal` (routes to `/login/leader` or `/manager`)
     - `System Administrator` (routes to `/login/admin` or `/admin`)
2. **Hero Banner Section**: Rotating slide items with title, subtitle, and primary checkout CTA buttons.
3. **Categories Card Section**: Visual grid of key ethnic garment categories.
4. **Bestsellers Product Grid**:
   - Product cards with double-image swapping on hover (switches from primary to secondary view).
   - Star reviews, brand tags, price, and a quick-add action.
5. **Customer Reviews Section**: Horizontal carousel of user ratings.
6. **Slide-Out Cart Drawer**:
   - Hidden by default.
   - Slides from the right with items, qty selectors, and a checkout button.
7. **Maroon Footer**: Multiple columns for links, newsletter signup, and credit card icons.

### Phase 2.3: State & Logic Implementation (`landing.ts`)
- Manage active image slide indexes.
- Manage shopping cart items state (adding, removing, changing quantities, subtotal calculations).
- Toggle cart drawer and account portal dropdown visibilities.
- Seed elegant mock products representing sarees, dhotis, and couple collections.
