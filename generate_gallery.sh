#!/bin/bash

# Script to generate gallery.html from all images in the gallery directory

GALLERY_DIR="gallery"
TEMPLATE_FILE="gallery-template.html"
OUTPUT_FILE="gallery.html"

echo "Generating gallery page..."

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

# Initialize gallery items HTML
gallery_items=""

# Counter for images
count=0

# Process all image files
find "$GALLERY_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | sort | while read -r img; do
    # Get filename without path
    filename=$(basename "$img")

    # Generate alt text from filename (remove extension and replace special chars)
    alt_text=$(echo "$filename" | sed 's/\.[^.]*$//' | sed 's/[-_]/ /g')

    # Add gallery item HTML
    echo "                <div class=\"gallery-item\">"
    echo "                    <img src=\"$img\" alt=\"Zoloti Maky - $alt_text\">"
    echo "                </div>"

    ((count++))
done > /tmp/gallery_items.txt

# Read the generated items
gallery_items=$(cat /tmp/gallery_items.txt)
count=$(wc -l < /tmp/gallery_items.txt)
count=$((count / 3))  # Each item is 3 lines

# Check if any images were found
if [ $count -eq 0 ]; then
    echo "Warning: No images found in $GALLERY_DIR directory"
    gallery_items="                <p style=\"text-align: center; grid-column: 1/-1;\">No images found in gallery.</p>"
else
    echo "Found $count images"
fi

# Generate final HTML by replacing placeholder
awk '
/<!-- GALLERY_ITEMS_PLACEHOLDER -->/ {
    system("cat /tmp/gallery_items.txt")
    next
}
{ print }
' "$TEMPLATE_FILE" > "$OUTPUT_FILE"

# Cleanup
rm -f /tmp/gallery_items.txt

echo "Gallery page generated: $OUTPUT_FILE"
echo "Total images: $count"
