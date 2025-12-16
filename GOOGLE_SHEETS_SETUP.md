# Google Sheets Setup Guide

## Overview
The app uses Google Sheets as a backend for storing:
- Coupon definitions (read-only with API key)
- Current claim states (read-only with API key)
- Request history (requires OAuth2 for write access)

## Quick Setup (Read-Only)

If you only need to read from Google Sheets:

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project

2. **Enable Google Sheets API**
   - In your project, go to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it

3. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

4. **Create Google Sheet**
   - Follow the instructions in `google-sheets-data.md`
   - Make the sheet publicly readable:
     - Click "Share" button
     - Under "General access", change to "Anyone with the link"
     - Set role to "Viewer"

5. **Configure App**
   - Copy the spreadsheet ID from the URL
   - Create `.env` file with:
     ```
     VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
     VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
     ```

## Advanced Setup (Write Access)

To enable write access for updating claim counts and saving request history:

### Option 1: Service Account (Recommended)

1. **Create Service Account**
   - Go to Google Cloud Console > "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Give it a name (e.g., "coupon-app-service")
   - Click "Create and Continue"
   - Skip granting roles (or add "Editor" for easier setup)
   - Click "Done"

2. **Create Service Account Key**
   - Find your service account in the list
   - Click on it > "Keys" tab
   - "Add Key" > "Create new key"
   - Choose "JSON" and download the key file

3. **Share the Google Sheet**
   - Open the JSON key file and copy the `client_email`
   - In your Google Sheet, click "Share"
   - Paste the service account email
   - Give it "Editor" access

4. **Update the App** (Requires code changes)
   - You'll need to update the googleSheets service to use JWT authentication
   - Store the service account credentials securely (not in frontend)

### Option 2: OAuth2 Flow

1. **Create OAuth Client ID**
   - Go to Google Cloud Console > "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add your domain to "Authorized JavaScript origins"
   - Add your redirect URI to "Authorized redirect URIs"

2. **Implement OAuth2 Flow**
   - This requires significant backend implementation
   - Users would need to authenticate with Google
   - Store refresh tokens securely

## Current Limitations

- The current implementation uses API key for read access
- Write operations are placeholders that require OAuth2 setup
- For production use, consider:
  - Implementing a backend server to handle Google Sheets operations
  - Using a proper database instead of Google Sheets
  - Adding authentication for users

## Security Notes

- **Never expose service account keys in frontend code**
- API keys should be restricted to your domain
- Consider rate limiting on your Google Sheets
- Regularly rotate your credentials