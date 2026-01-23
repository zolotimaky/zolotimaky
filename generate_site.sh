#!/bin/bash

# ==============================================================================
# Site Generation Script for Zoloti Maky Dance Ensemble Website
# ==============================================================================
#
# This script automates the build process for the Zoloti Maky website:
#
# 1. Copies static images from images/ to docs/images/
# 2. Optimizes gallery images in gallery/ to 1080px (for lightbox display)
# 3. Creates 720px thumbnails in docs/thumbnails/ (for carousel/grid)
# 4. Generates HTML pages from templates (index.html and gallery.html)
# 5. Randomizes gallery image order on each build
#
# Directory Structure:
#   gallery/           - Source gallery images (any resolution)
#   images/            - Static site images (logos, decorations)
#   templates/         - HTML templates with placeholders
#   docs/              - Generated site (ready for deployment)
#   docs/gallery/      - Optimized gallery images (1080px)
#   docs/thumbnails/   - Gallery thumbnails (720px)
#   docs/images/       - Copied static images
#
# Usage:
#   ./generate_site.sh
#
# Requirements:
#   - macOS with sips command for image processing
#   - Bash shell
#
# ==============================================================================

GALLERY_DIR="gallery"
IMAGES_DIR="images"
DOCS_IMAGES_DIR="docs/images"
DOCS_GALLERY_DIR="docs/gallery"
THUMBNAILS_DIR="docs/thumbnails"
INDEX_TEMPLATE="templates/index-template.html"
GALLERY_TEMPLATE="templates/gallery-template.html"
LIGHTBOX_TEMPLATE="templates/lightbox-template.html"
INDEX_OUTPUT="docs/index.html"
GALLERY_OUTPUT="docs/gallery.html"

# Function to normalize filename: lowercase and replace spaces with underscores
normalize_filename() {
    local filename="$1"
    # Convert to lowercase and replace spaces with underscores
    echo "$filename" | tr '[:upper:]' '[:lower:]' | tr ' ' '_'
}

echo "========================================="
echo "  Gallery Generator with Optimization"
echo "========================================="
echo ""

# Check if gallery directory exists
if [ ! -d "$GALLERY_DIR" ]; then
    echo "Error: Gallery directory not found!"
    exit 1
fi

# Check if templates exist
if [ ! -f "$INDEX_TEMPLATE" ]; then
    echo "Error: Index template not found!"
    exit 1
fi

if [ ! -f "$GALLERY_TEMPLATE" ]; then
    echo "Error: Gallery template not found!"
    exit 1
fi

if [ ! -f "$LIGHTBOX_TEMPLATE" ]; then
    echo "Error: Lightbox template not found!"
    exit 1
fi

# Create necessary directories
mkdir -p "$THUMBNAILS_DIR"
mkdir -p "$DOCS_IMAGES_DIR"
mkdir -p "$DOCS_GALLERY_DIR"

echo "Step 1: Copying static images from images/ to docs/images/..."
echo "--------------------------------------------"

# Copy all images from images/ to docs/images/ with normalized filenames
if [ -d "$IMAGES_DIR" ]; then
    copied=0
    find "$IMAGES_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.svg" \) | while read -r img; do
        filename=$(basename "$img")
        normalized_filename=$(normalize_filename "$filename")
        cp "$img" "$DOCS_IMAGES_DIR/$normalized_filename"
        echo $((copied + 1)) > /tmp/copied_count.txt
    done

    copied=$(cat /tmp/copied_count.txt 2>/dev/null || echo 0)
    rm -f /tmp/copied_count.txt

    echo "  ✓ Copied $copied static images (normalized to lowercase)"
else
    echo "  ⚠ Warning: images/ directory not found"
fi
echo ""

echo "Step 2: Optimizing gallery images to 1080px and copying to docs/gallery/..."
echo "--------------------------------------------"

optimized_count=0
copied_count=0

find "$GALLERY_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
    filename=$(basename "$img")
    normalized_filename=$(normalize_filename "$filename")
    dest_path="$DOCS_GALLERY_DIR/$normalized_filename"

    # Get dimensions
    width=$(sips -g pixelWidth "$img" 2>/dev/null | tail -1 | awk '{print $2}')
    height=$(sips -g pixelHeight "$img" 2>/dev/null | tail -1 | awk '{print $2}')

    # Check if valid numbers
    if ! [[ "$width" =~ ^[0-9]+$ ]] || ! [[ "$height" =~ ^[0-9]+$ ]]; then
        continue
    fi

    # Resize to 1080px and copy to docs/gallery with normalized name
    if [ "$width" -gt 1080 ] || [ "$height" -gt 1080 ]; then
        echo "  Optimizing $filename -> $normalized_filename (1080px)..."
        sips --resampleHeightWidthMax 1080 "$img" --out "$dest_path" > /dev/null 2>&1
        echo $((optimized_count + 1)) > /tmp/optimized_count.txt
    else
        # Just copy with normalized name
        cp "$img" "$dest_path"
        echo $((copied_count + 1)) > /tmp/copied_count.txt
    fi
done

optimized_count=$(cat /tmp/optimized_count.txt 2>/dev/null || echo 0)
copied_count=$(cat /tmp/copied_count.txt 2>/dev/null || echo 0)
rm -f /tmp/optimized_count.txt /tmp/copied_count.txt

echo "  ✓ Optimized and copied: $optimized_count images"
echo "  ✓ Copied as-is: $copied_count images"
echo ""

echo "Step 3: Creating 720px thumbnails..."
echo "--------------------------------------------"

thumbnail_count=0

find "$GALLERY_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
    filename=$(basename "$img")
    normalized_filename=$(normalize_filename "$filename")
    thumbnail_path="$THUMBNAILS_DIR/$normalized_filename"

    # Create thumbnail (720px max) with normalized filename
    sips --resampleHeightWidthMax 720 "$img" --out "$thumbnail_path" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo $((thumbnail_count + 1)) > /tmp/thumbnail_count.txt
    fi
done

thumbnail_count=$(wc -l < /tmp/thumbnail_count.txt 2>/dev/null || echo 0)
rm -f /tmp/thumbnail_count.txt

echo "  ✓ Created $thumbnail_count thumbnails (normalized to lowercase)"
echo ""

echo "Step 4: Generating HTML pages..."
echo "--------------------------------------------"

# Counter for images
count=0

# Priority image to always show first
PRIORITY_IMAGE="b945deee-593c-40d2-a20f-ab79aa32796c.jpg"

# Process all image files and generate both carousel and grid items
# First output priority image, then randomize the rest
{
    # First, output the priority image if it exists
    priority_path="$GALLERY_DIR/$PRIORITY_IMAGE"
    if [ -f "$priority_path" ]; then
        filename=$(basename "$priority_path")
        normalized_filename=$(normalize_filename "$filename")
        alt_text=$(echo "$normalized_filename" | sed 's/\.[^.]*$//' | sed 's/[-_]/ /g')
        thumbnail_src="thumbnails/$normalized_filename"
        fullsize_src="gallery/$normalized_filename"

        echo "                        <div class=\"gallery-item\" data-fullsize=\"$fullsize_src\">"
        echo "                            <img src=\"$thumbnail_src\" alt=\"Zoloti Maky - $alt_text\">"
        echo "                        </div>"
        ((count++))
    fi

    # Then output all other images in random order
    find "$GALLERY_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
        filename=$(basename "$img")

        # Skip the priority image since we already added it
        if [ "$filename" = "$PRIORITY_IMAGE" ]; then
            continue
        fi

        normalized_filename=$(normalize_filename "$filename")
        alt_text=$(echo "$normalized_filename" | sed 's/\.[^.]*$//' | sed 's/[-_]/ /g')
        thumbnail_src="thumbnails/$normalized_filename"
        fullsize_src="gallery/$normalized_filename"

        echo "                        <div class=\"gallery-item\" data-fullsize=\"$fullsize_src\">"
        echo "                            <img src=\"$thumbnail_src\" alt=\"Zoloti Maky - $alt_text\">"
        echo "                        </div>"

        ((count++))
    done | sort -R
} > /tmp/gallery_carousel_items.txt

# Copy for grid layout with adjusted indentation
sed 's/^                        /                /' /tmp/gallery_carousel_items.txt > /tmp/gallery_grid_items.txt

# Read count
count=$(wc -l < /tmp/gallery_carousel_items.txt)
count=$((count / 3))  # Each item is 3 lines

if [ $count -eq 0 ]; then
    echo "  Warning: No images found!"
else
    echo "  Found $count images"
fi

# Generate index.html
awk '
/<!-- GALLERY_CAROUSEL_ITEMS_PLACEHOLDER -->/ {
    system("cat /tmp/gallery_carousel_items.txt")
    next
}
/<!-- LIGHTBOX_PLACEHOLDER -->/ {
    system("cat '"$LIGHTBOX_TEMPLATE"'")
    next
}
{ print }
' "$INDEX_TEMPLATE" > "$INDEX_OUTPUT"

# Generate gallery.html
awk '
/<!-- GALLERY_ITEMS_PLACEHOLDER -->/ {
    system("cat /tmp/gallery_grid_items.txt")
    next
}
/<!-- LIGHTBOX_PLACEHOLDER -->/ {
    system("cat '"$LIGHTBOX_TEMPLATE"'")
    next
}
{ print }
' "$GALLERY_TEMPLATE" > "$GALLERY_OUTPUT"

# Cleanup
rm -f /tmp/gallery_carousel_items.txt
rm -f /tmp/gallery_grid_items.txt

echo ""
echo "========================================="
echo "  ✓ Gallery Generation Complete!"
echo "========================================="
echo ""
echo "Image Sizes:"
echo "  • Gallery (1080px max) - Used in lightbox"
echo "  • Thumbnails (720px) - Used in carousel/grid"
echo ""
echo "Generated Files:"
echo "  • $INDEX_OUTPUT (carousel with $count images)"
echo "  • $GALLERY_OUTPUT (grid with $count images)"
echo "  • Image order is identical in both"
echo ""
echo "Performance:"
echo "  ✓ Fast loading with 720px thumbnails"
echo "  ✓ High quality lightbox with 1080px images"
echo ""
