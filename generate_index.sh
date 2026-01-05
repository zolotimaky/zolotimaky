#!/bin/bash

# Script to generate index.html from template with all gallery images

GALLERY_DIR="gallery"
TEMPLATE_FILE="index-template.html"
OUTPUT_FILE="index.html"

echo "Generating index.html with gallery images..."

# Check if gallery directory exists
if [ ! -d "$GALLERY_DIR" ]; then
    echo "Error: Gallery directory not found!"
    exit 1
fi

# Check if template exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Error: Template file not found!"
    exit 1
fi

# Counter for images
count=0

# Process all image files and generate carousel items
find "$GALLERY_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | sort | while read -r img; do
    # Get filename without path
    filename=$(basename "$img")

    # Generate alt text from filename (remove extension and replace special chars)
    alt_text=$(echo "$filename" | sed 's/\.[^.]*$//' | sed 's/[-_]/ /g')

    # Add gallery item HTML
    echo "                        <div class=\"gallery-item\">"
    echo "                            <img src=\"$img\" alt=\"Zoloti Maky - $alt_text\">"
    echo "                        </div>"

    ((count++))
done > /tmp/gallery_carousel_items.txt

# Read the generated items
count=$(wc -l < /tmp/gallery_carousel_items.txt)
count=$((count / 3))  # Each item is 3 lines

# Check if any images were found
if [ $count -eq 0 ]; then
    echo "Warning: No images found in $GALLERY_DIR directory"
else
    echo "Found $count images"
fi

# Generate final HTML by replacing placeholder
awk '
/<!-- GALLERY_CAROUSEL_ITEMS_PLACEHOLDER -->/ {
    system("cat /tmp/gallery_carousel_items.txt")
    next
}
{ print }
' "$TEMPLATE_FILE" > "$OUTPUT_FILE"

# Cleanup
rm -f /tmp/gallery_carousel_items.txt

echo "Index page generated: $OUTPUT_FILE"
echo "Total images in carousel: $count"
