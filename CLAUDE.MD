# CLAUDE.MD - Zoloti Maky Dance Group Landing Page

## Project Overview
This is a landing page website for "Zoloti Maky" (Golden Poppies) - a dance group. The site showcases the group's activities, performances, and provides information to visitors and potential members.

## Working Relationship
- The project owner (you) is non-technical
- Claude leads all technical decisions
- Technical choices tailored to the landing page's purpose
- User provides content, design preferences, and feedback
- Claude handles implementation end-to-end

## Site Visitors
- General public interested in the dance group
- Potential students/members
- Event organizers
- Non-technical audience (site should be simple and intuitive)

## Technical Stack
Claude will make technical decisions based on:
- Landing page best practices
- Performance and SEO
- Ease of content updates
- Hosting simplicity for non-technical owner

## Project Structure

### Source Directories
- **gallery/** - Original gallery images (high resolution photos)
  - Images are automatically resized to 1080px max for lightbox display
  - Thumbnails (720px) are generated for carousel/grid display
  - File names should use lowercase with underscores instead of spaces

- **templates/** - HTML page templates
  - `index-template.html` - Main landing page template
  - `gallery-template.html` - Full gallery page template
  - `lightbox-template.html` - Reusable lightbox component
  - Templates use placeholders (e.g., `<!-- GALLERY_CAROUSEL_ITEMS_PLACEHOLDER -->`)

- **images/** - Static page images (logos, decorative elements, section images)
  - Copied directly to `docs/images/` during site generation
  - Use lowercase names with underscores instead of spaces

- **llms/** - Documentation and context files in markdown format
  - Technical documentation for AI assistants
  - Design guidelines, typography specs, gallery instructions

### Generated Directory (Distribution)
- **docs/** - Generated site ready for deployment (GitHub Pages compatible)
  - `docs/index.html` - Generated main page
  - `docs/gallery.html` - Generated full gallery page
  - `docs/styles.css` - Site stylesheet
  - `docs/script.js` - Site JavaScript
  - `docs/images/` - Static images copied from `images/`
  - `docs/gallery/` - Optimized gallery images (1080px max)
  - `docs/thumbnails/` - Gallery thumbnails (720px max)

### Build System
- **generate_site.sh** - Automated site generation script
  - Optimizes source images in `gallery/` to 1080px (for lightbox)
  - Creates 720px thumbnails in `docs/thumbnails/` (for carousel/grid)
  - Injects gallery items into templates using placeholders
  - Generates both `index.html` and `gallery.html`
  - Randomizes image order on each run

## Key Features
1. **About the Group** - Introduction and background of Zoloti Maky
2. **Photo/Video Gallery** - Showcase performances and activities
3. **Services** - Details to be determined during development
4. **Inquiry Form** - Contact form for questions and bookings
5. **Mobile-responsive design** - Works on all devices

## User Interaction Guidelines
- Claude makes all technical decisions and explains them simply
- User provides:
  - Content (text, images, videos)
  - Design preferences (colors, layout ideas, inspiration)
  - Feedback on functionality and appearance
- Claude explains changes in plain language
- No technical knowledge required from user

## Development Approach
1. Gather requirements from user
2. Create simple, maintainable code
3. Test thoroughly before showing to user
4. Provide clear instructions for:
   - Viewing the site locally
   - Deploying the site
   - Making future updates

## Notes
- Keep code simple and well-documented
- Prioritize ease of updates (content should be easy to change)
- Focus on visual appeal and user experience
- Ensure mobile compatibility
- Consider performance (fast loading times)

## Technical Implementation

### Image Optimization
- **Gallery Images**: Resized to 1080px max (maintains aspect ratio)
- **Thumbnails**: Resized to 720px max (maintains aspect ratio)
- **Tool**: macOS `sips` command for image processing
- **Format**: Preserves original format (JPG/PNG)

### Gallery System
- Automated generation from source images
- Randomized display order on each build
- Two display modes:
  - Carousel on main page (horizontal scrolling)
  - Grid on gallery page (responsive grid layout)
- Lightbox with keyboard navigation

### Styling & Design
- Color scheme: Orange (#e87605) with Ukrainian blue/red accents
- Typography: Aptos font family
- Responsive design (mobile-first approach)
- Decorative poppy images as section dividers

## Current Status
Site is fully functional with:
- ✓ Responsive navigation
- ✓ Hero section with animated logo
- ✓ About section with team info
- ✓ Dance packages (3 service offerings)
- ✓ Automated gallery with lightbox
- ✓ Contact form with social media links
- ✓ Photo credits section
- ✓ Decorative section dividers

Deployment: Ready for GitHub Pages (docs/ folder)
