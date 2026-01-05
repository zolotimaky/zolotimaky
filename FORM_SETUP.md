# Contact Form Setup Instructions

## Web3Forms Integration

The contact form uses **Web3Forms** - a free service that sends form submissions directly to your email.

### Setup Steps:

1. **Get your free Access Key:**
   - Go to: https://web3forms.com
   - Enter your email address (zolotimaky@gmail.com)
   - Click "Create Access Key"
   - Check your email and verify
   - Copy the Access Key they send you

2. **Add the Access Key to your website:**
   - Open: `templates/index-template.html`
   - Find the line: `<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">`
   - Replace `YOUR_ACCESS_KEY_HERE` with your actual access key
   - Run: `./generate_site.sh` to regenerate the site
   - Commit and push the changes

3. **Test the form:**
   - Open your website
   - Fill out and submit the contact form
   - You should receive the form submission at your email
   - User sees "Thank you!" message

### Features:
- ✅ Free (250 submissions/month)
- ✅ No backend code required
- ✅ Email notifications sent instantly
- ✅ Spam protection included
- ✅ Works on GitHub Pages

### Form Fields:
- Name (required)
- Email (required)
- Phone (optional)
- Inquiry Type:
  - Large full-group performance
  - Small weddings & private parties
  - 30-minute interactive add-on
  - Other questions
- Message (required)

### Success Message:
After successful submission, users see: "Thank you!"

### Important:
DO NOT commit your access key to a public repository if you want to keep it private. However, Web3Forms access keys are safe to expose as they only allow sending to your verified email address.
