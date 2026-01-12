# Skyliner Diner — Franchise Lead-Gen Website (Front-End Only)

Mobile-first, responsive, premium marketing site for a restaurant franchise concept (no online ordering, no pricing, no e-commerce).

## Folder structure

```
/workspace
  index.html
  logo.svg
  /assets
    /css
      styles.css
    /js
      main.js
    /images
      image-1.jpg
      image-2.jpg
      image-3.jpg
```

> Note: `image-1.jpg`, `image-2.jpg`, `image-3.jpg` are referenced as placeholders. If you don’t add real files yet, the site will show a styled fallback label instead of breaking the layout.

## Site structure (sections + purpose)

1. **Fixed glass navbar**
   - Purpose: quick navigation + primary CTA.
   - Interaction: smooth-scroll, active-section highlight, collapses on mobile after click.

2. **Hero**
   - Purpose: immediate brand story + franchise intent (“Request the Deck”).
   - Interaction: modal CTA, animated metric counters, subtle scroll-based hero parallax (CSS variable), lazy-resilient hero media.

3. **Why Skyliner**
   - Purpose: brand differentiation + airplane fuselage storytelling.
   - Interaction: scroll reveal animations, responsive media grid.

4. **The Experience**
   - Purpose: explain the “gate to plate” journey and signature moments.
   - Interaction: scroll reveal cards + CTA.

5. **Franchise Model**
   - Purpose: communicate support + scalability (without pricing or ordering).
   - Interaction: accordion for model details.

6. **Your Flight Path**
   - Purpose: show a clear process from inquiry to opening.
   - Interaction: timeline with scroll reveal.

7. **Gallery**
   - Purpose: showcase the concept visually.
   - Interaction: Bootstrap carousel; images are fully responsive (no hard-coded dimensions).

8. **FAQ**
   - Purpose: remove friction + qualify leads.
   - Interaction: accordion.

9. **Contact / Lead**
   - Purpose: conversion section with an inline lead form + contact methods.
   - Interaction: form validation, local save for demo, “open email draft” mailto CTA.

Footer includes secondary navigation and branding.

## Interactive elements included

- **Modal (pop-up)**: “Request the franchise deck”
- **Lazy loading**: all non-hero images use `loading="lazy"`
- **Scroll reveal**: IntersectionObserver-based, motion-safe
- **Counters**: animated numbers on first view
- **Carousel**: Bootstrap slider for gallery
- **Accordions**: franchise model + FAQ
- **Back-to-top button**: appears after scrolling
- **Image error fallback**: if placeholders are missing, a branded fallback appears (no broken layout)

## Branding: airplane-fuselage theme

Copy and UI elements reference aviation intentionally:
- “Boarding pass to ownership”
- “Your flight path to opening day”
- “The airplane isn’t a prop. It’s the centerpiece.”
- “Your competitor buys ads. You park an airplane and become the ad.”

## Customization (global variables)

Edit theme tokens in:
- `assets/css/styles.css` → `:root { ... }`

You can quickly customize:
- **Fonts**: `--font-sans`, `--font-display`
- **Colors**: `--color-bg`, `--color-surface`, `--color-primary`, etc.
- **Spacing**: `--section-pad`

## Replacing images (non-breaking)

Put your files here:
- `assets/images/image-1.jpg` (hero / exterior)
- `assets/images/image-2.jpg` (cabin seating / interior)
- `assets/images/image-3.jpg` (food / ambiance)

No widths/heights are hardcoded; images use fluid sizing and `object-fit` so aspect ratios won’t break layout.

## Forms (no backend)

Forms are **front-end only**:
- Valid submissions are saved to `localStorage` key: `skylinerLeads`
- “Open email draft” generates a pre-filled `mailto:` message

To connect to a real CRM later, replace the submit handler in `assets/js/main.js` with a POST to your endpoint (or a serverless form service).

