#!/bin/bash

# Unified gallery generator with automatic image optimization
# - Resizes source images in gallery/ to 1080px (full-size for lightbox)
# - Creates 480px thumbnails for carousel/grid display
# - Generates both index.html and gallery.html

GALLERY_DIR="gallery"
THUMBNAILS_DIR="thumbnails"
INDEX_TEMPLATE="index-template.html"
GALLERY_TEMPLATE="gallery-template.html"
LIGHTBOX_TEMPLATE="lightbox-template.html"
INDEX_OUTPUT="index.html"
GALLERY_OUTPUT="gallery.html"

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

# Create thumbnails directory if it doesn't exist
mkdir -p "$THUMBNAILS_DIR"

echo "Step 1: Optimizing source images in gallery/ to 1080px..."
echo "--------------------------------------------"

optimized_count=0
skipped_count=0

find "$GALLERY_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
    # Get dimensions
    width=$(sips -g pixelWidth "$img" 2>/dev/null | tail -1 | awk '{print $2}')
    height=$(sips -g pixelHeight "$img" 2>/dev/null | tail -1 | awk '{print $2}')

    # Check if valid numbers
    if ! [[ "$width" =~ ^[0-9]+$ ]] || ! [[ "$height" =~ ^[0-9]+$ ]]; then
        continue
    fi

    # Resize source to 1080px if larger (for lightbox)
    if [ "$width" -gt 1080 ] || [ "$height" -gt 1080 ]; then
        filename=$(basename "$img")
        echo "  Resizing $filename to 1080px..."
        sips --resampleHeightWidthMax 1080 "$img" --out "$img" > /dev/null 2>&1
        echo $((optimized_count + 1)) > /tmp/optimized_count.txt
    else
        echo $((skipped_count + 1)) > /tmp/skipped_count.txt
    fi
done

optimized_count=$(cat /tmp/optimized_count.txt 2>/dev/null || echo 0)
skipped_count=$(cat /tmp/skipped_count.txt 2>/dev/null || echo 0)
rm -f /tmp/optimized_count.txt /tmp/skipped_count.txt

echo "  ✓ Optimized: $optimized_count images"
echo "  ✓ Already optimal: $skipped_count images"
echo ""

echo "Step 2: Creating 480px thumbnails..."
echo "--------------------------------------------"

thumbnail_count=0

find "$GALLERY_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
    filename=$(basename "$img")
    thumbnail_path="$THUMBNAILS_DIR/$filename"

    # Create thumbnail (480px max)
    sips --resampleHeightWidthMax 480 "$img" --out "$thumbnail_path" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo $((thumbnail_count + 1)) > /tmp/thumbnail_count.txt
    fi
done

thumbnail_count=$(wc -l < /tmp/thumbnail_count.txt 2>/dev/null || echo 0)
rm -f /tmp/thumbnail_count.txt

echo "  ✓ Created $thumbnail_count thumbnails"
echo ""

echo "Step 3: Generating HTML pages..."
echo "--------------------------------------------"

# Counter for images
count=0

# Process all image files and generate both carousel and grid items
# Use sort -R to randomize order on each run
find "$GALLERY_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | sort -R | while read -r img; do
    # Get filename without path
    filename=$(basename "$img")

    # Generate alt text from filename (remove extension and replace special chars)
    alt_text=$(echo "$filename" | sed 's/\.[^.]*$//' | sed 's/[-_]/ /g')

    # Paths for thumbnail and full-size
    thumbnail_src="$THUMBNAILS_DIR/$filename"
    fullsize_src="$img"

    # Generate carousel item (for index.html) - thumbnail with data-fullsize attribute
    echo "                        <div class=\"gallery-item\" data-fullsize=\"$fullsize_src\">"
    echo "                            <img src=\"$thumbnail_src\" alt=\"Zoloti Maky - $alt_text\">"
    echo "                        </div>"

    ((count++))
done > /tmp/gallery_carousel_items.txt

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
echo "  • Thumbnails (480px) - Used in carousel/grid"
echo ""
echo "Generated Files:"
echo "  • $INDEX_OUTPUT (carousel with $count images)"
echo "  • $GALLERY_OUTPUT (grid with $count images)"
echo "  • Image order is identical in both"
echo ""
echo "Performance:"
echo "  ✓ Fast loading with 480px thumbnails"
echo "  ✓ High quality lightbox with 1080px images"
echo ""
