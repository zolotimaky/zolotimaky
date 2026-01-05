# Typography System - Zoloti Maky

## Overview
This site uses a standardized typography system with the **Aptos** font family. All text styles are centralized and reusable.

---

## Standard Text Styles

### Header 1 (.header1 or `<h1>`)
**Use for:** Main page titles, hero section titles

```html
<h1>Zoloti Maky</h1>
<!-- or -->
<div class="header1">Zoloti Maky</div>
```

**Specs:**
- Font size: 5rem (80px)
- Weight: 700 (Bold)
- Color: Gold (#d4af37)
- Letter spacing: 2px

---

### Header 2 (.header2 or `<h2>`)
**Use for:** Section titles (About Us, Our Services, Gallery, etc.)

```html
<h2>About Us</h2>
<!-- or -->
<div class="header2">About Us</div>
```

**Specs:**
- Font size: 3rem (48px)
- Weight: 700 (Bold)
- Color: Gold (#d4af37)
- Letter spacing: 1px

---

### Header 3 (.header3 or `<h3>`)
**Use for:** Subsection titles, card titles

```html
<h3>Contact Information</h3>
<!-- or -->
<div class="header3">Contact Information</div>
```

**Specs:**
- Font size: 2rem (32px)
- Weight: 700 (Bold)
- Color: Gold (#d4af37)
- Letter spacing: 0.5px

---

### Regular Text (.text-regular or `<p>`)
**Use for:** Body copy, descriptions, general content

```html
<p>Zoloti Maky is a San Francisco-based Ukrainian dance ensemble...</p>
<!-- or -->
<div class="text-regular">Your text here</div>
```

**Specs:**
- Font size: 1rem (16px)
- Weight: 300 (Light)
- Color: Gray (#b8b8b8)
- Line height: 1.8

---

### Bold Text (.text-bold, `<strong>`, or `<b>`)
**Use for:** Emphasis, important words

```html
<p><strong>Zoloti Maky</strong> is a dance ensemble...</p>
<!-- or -->
<span class="text-bold">Important text</span>
```

**Specs:**
- Weight: 600 (Semi-bold)
- Color: Gold (#d4af37)
- Inherits size from parent

---

### Note Text (.text-note)
**Use for:** Small annotations, footnotes, captions

```html
<p class="text-note">Photo taken at our annual performance, 2025</p>
```

**Specs:**
- Font size: 0.875rem (14px)
- Weight: 300 (Light)
- Color: Muted gray (#808080)
- Style: Italic

---

### Button Text (.btn)
**Use for:** Call-to-action buttons

```html
<a href="#contact" class="btn btn-primary">Get in Touch</a>
<button class="btn btn-primary">Send Message</button>
```

**Specs:**
- Font size: 0.95rem (15.2px)
- Weight: 500 (Medium)
- Letter spacing: 1.5px
- Transform: UPPERCASE

---

## Font Fallback Chain

All text uses this font stack:
```css
'Aptos', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif
```

**This means:**
1. **Aptos** - Used if available (modern Windows/Office)
2. **Segoe UI** - Fallback for Windows
3. **Helvetica Neue** - Fallback for Mac
4. **Arial** - Universal fallback
5. **sans-serif** - System default

---

## Color Variables

- `--primary-gold`: #d4af37 (Headers, accents, emphasis)
- `--text-light`: #f5f5f5 (Main light text)
- `--text-gray`: #b8b8b8 (Body text)
- `--text-muted`: #808080 (Notes, secondary text)

---

## Responsive Adjustments

On mobile (< 768px):
- Header 1: 3rem → 48px
- Header 2: 2.5rem → 40px
- Other sizes scale proportionally

---

## Examples

### Good Example - Using Classes
```html
<section>
  <h2 class="section-title">Our Services</h2>
  <p>Professional dance performances for all occasions.</p>
  <p class="text-note">*Prices may vary based on event size</p>
</section>
```

### Good Example - Using HTML Elements
```html
<article>
  <h1>Welcome</h1>
  <p><strong>Zoloti Maky</strong> brings Ukrainian dance to life.</p>
  <p>Contact us today to book your event.</p>
</article>
```

---

## Need to Change Fonts Site-Wide?

Just edit the font-family in `/styles.css` at the **Typography System** section (lines 43-123). Changes will apply everywhere automatically!
