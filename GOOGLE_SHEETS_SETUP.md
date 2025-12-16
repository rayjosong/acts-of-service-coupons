## Google Sheets Setup Guide

## Overview
The app uses Google Sheets as a backend for storing:
- Coupon definitions (static data)
- Current claim states (dynamic counts)
- Request history (redemption logs)

## Setup with Service Account (Recommended for Single-User)

This approach uses a service account for direct API access without OAuth flow.

### 1. Create Google Cloud Project
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project

### 2. Enable Google Sheets API
   - In your project, go to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it

### 3. Create Service Account
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Give it a name (e.g., "coupon-app-service")
   - Click "Create and Continue"
   - Skip granting roles (optional for simplicity)
   - Click "Done"

### 4. Create Service Account Key
   - Find your service account in the list
   - Click on it > "Keys" tab
   - "Add Key" > "Create new key"
   - Choose "JSON" and download the key file

### 5. Create Google Sheet
   - Follow the instructions in `google-sheets-data.md`
   - Create the three sheets: Coupons, CouponState, RequestHistory

### 6. Share the Google Sheet
   - Open the JSON key file and copy the `client_email`
   - In your Google Sheet, click "Share"
   - Paste the service account email
   - Give it "Editor" access

### 7. Configure App
   - Copy the spreadsheet ID from the URL
   - Create `.env` file with:
     ```
     VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
     VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@your-project.iam.gserviceaccount.com
     VITE_GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"
     ```

## Troubleshooting

### JWT Authentication Issues
- Make sure the private key is properly formatted with \n for line breaks
- Verify the service account email is correct
- Check that the Google Sheets API is enabled
- Ensure the service account has Editor access to the sheet

### Testing
- Click the "Test Connection" button in the app
- Check browser console for detailed error messages
- Verify the spreadsheet ID is correct

### Common Errors
1. **"invalid_grant"**: Service account doesn't have access to the sheet
2. **"invalid_client"**: Service account key is invalid or malformed
3. **"forbidden"**: Sheet doesn't exist or wrong permissions

## Security Notes
- Service account credentials are stored in the frontend (acceptable for single-user)
- Keep your .env file private and add it to .gitignore
- The service account should only have access to this specific Google Sheet