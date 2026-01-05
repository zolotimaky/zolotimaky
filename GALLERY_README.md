# Gallery Generator System

This folder contains automated gallery generators that create photo galleries from all images in the `gallery/` directory.

## Files

### Templates (Don't edit these directly!)
- **index-template.html** - Template for the main page with carousel gallery
- **gallery-template.html** - Template for the full gallery page

### Generation Scripts
- **generate_index.sh** - Generates index.html with carousel of ALL gallery images
- **generate_gallery.sh** - Generates gallery.html with grid of ALL gallery images

### Generated Files (Auto-created by scripts)
- **index.html** - Main page with carousel gallery
- **gallery.html** - Full gallery page with grid layout

## How to Use

### When Adding New Photos

Whenever you add new photos to the `gallery/` folder, run BOTH scripts:

```bash
./generate_index.sh    # Updates main page carousel
./generate_gallery.sh  # Updates full gallery page
```

Or run them together:
```bash
./generate_index.sh && ./generate_gallery.sh
```

### What Each Script Does

**generate_index.sh:**
- Scans all images in `gallery/` directory
- Generates `index.html` with carousel containing ALL images
- Carousel shows 2-4 images at a time (responsive)

**generate_gallery.sh:**
- Scans all images in `gallery/` directory
- Generates `gallery.html` with grid of ALL images
- Grid is fully responsive with lightbox zoom

### Supported Formats

- JPG/JPEG
- PNG

### Features

**Main Page Carousel (index.html):**
- Shows 4 images at once on desktop
- Shows 3 images at once on tablet
- Shows 2 images at once on mobile
- Navigation arrows to scroll through all images
- Click to zoom with lightbox

**Full Gallery Page (gallery.html):**
- Responsive grid layout
- Lightbox zoom on click
- All images displayed at once

## Current Status

- **Total Images:** 95
- **Last Generated:** Check timestamps on `index.html` and `gallery.html`

## Customizing

To change layouts or styling:

1. **For main page:** Edit `index-template.html`
2. **For gallery page:** Edit `gallery-template.html`
3. Run the appropriate script(s) to regenerate

The scripts preserve your template changes and insert all current gallery images.
