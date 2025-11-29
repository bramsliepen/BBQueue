# GitHub Gist Sync Setup

This project uses GitHub Gist as a shared state store for real-time synchronization between multiple pages.

## Setup Steps

### 1. Create a GitHub Gist

1. Go to https://gist.github.com/
2. Create a **new gist** with:
   - **Filename:** `status.json`
   - **Content:**
     ```json
     {
       "trafficLight": "gray",
       "messageText": "Selecteer een status..."
     }
     ```
3. Click "Create public gist"
4. **Copy the Gist ID** from the URL:
   - URL format: `https://gist.github.com/username/GIST_ID`
   - Example: `https://gist.github.com/bramsliepen/abc123def456...`
   - The `GIST_ID` is the long alphanumeric string

### 2. Create a GitHub Personal Access Token (PAT)

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. **Token name:** `BBQueue-Gist-API`
4. **Scopes:** Check only `gist`
5. Click "Generate token"
6. **Copy and save** the token (you'll only see it once!)

### 3. Update Your Files

Replace the placeholders in your code:

**In `script.js` (primary page):**
- Find: `const GIST_ID = 'YOUR_GIST_ID_HERE';`
- Replace with: `const GIST_ID = 'your-actual-gist-id';`
- Find: `const GITHUB_PAT = 'YOUR_GITHUB_PAT_HERE';`
- Replace with: `const GITHUB_PAT = 'your-actual-pat';`

**In `secondary-viewer.html` (secondary page):**
- Find: `const GIST_ID = 'YOUR_GIST_ID_HERE';`
- Replace with: `const GIST_ID = 'your-actual-gist-id';`
- (No PAT needed for the secondary page—it only reads)

### 4. Deploy Both Pages

1. **Primary page** (`index.html`): Deploy to GitHub Pages
   - This page has write access via the PAT
   - When you click buttons, it updates the Gist automatically

2. **Secondary page** (`secondary-viewer.html`): Deploy to a separate GitHub Pages repo
   - This page only reads from the Gist
   - It polls every 3 seconds for updates

### 5. Test

1. Open both pages side-by-side
2. Click "Ga!" or "Stop!" on the primary page
3. The secondary page should update within ~3 seconds

## How It Works

- **Primary page reads:** Fetches latest state from Gist raw URL
- **Primary page writes:** Updates Gist via GitHub API with PAT
- **Secondary page reads:** Fetches latest state from Gist raw URL
- **Secondary page writes:** Not needed (read-only viewer)

## Security Notes

- The PAT is only used on the primary page for writes
- The secondary page has no secrets—it only reads public data
- Raw Gist URLs are public, so the state is visible to anyone with the URL
- If you need privacy, use a private Gist (but then both pages need to authenticate)

## Troubleshooting

**Secondary page shows "Connection lost..."**
- Check that your `GIST_ID` is correct
- Check browser console for CORS errors
- Verify the Gist exists and is public

**Primary page won't update Gist**
- Check that your PAT is correct and not expired
- Check browser console for API errors
- Verify the `GIST_ID` matches your Gist URL

**Changes on primary page don't sync**
- Check browser console for errors
- Verify polling is running (should see console logs every 3 seconds)
- Check the Gist directly on gist.github.com to see if it's being updated
