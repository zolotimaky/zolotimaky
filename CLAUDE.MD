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

## Project structure
- gallery - original gallery images. For each file there
  - Convert to jpeg 1080p and place into docs/gallery for distribution
  - Convert to 480p and place into docs/thumbnails
  - Image file names must be lowercase with no spaces or special characters (replace spaces with _).
- templates - html pages templates
- llms - additional context files in markdown format. Save new md files there
- images - page images. For each file there:
  - Copy to docs/images
  - Make sure to convert names to lower case, remove special characters and replace spaces with _
- generate_site.sh - site generation script that takes templates and produces a ready for distribution site. That includes gallery images conversion, images copying etc. Writes the result to docs directory.

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

## Current Status
Project initialized. Next steps:
1. Discuss design preferences and content
2. Choose appropriate technology stack
3. Begin development
