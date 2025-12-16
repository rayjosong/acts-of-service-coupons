# Google Sheets Data

## Sheet 1: Coupons

Copy this data into the "Coupons" sheet (row 1 is headers):

```csv
id,title,description,iconName,maxClaims,category,isActive
1,Bubble Tea Craving Satisfier,"I'll get you that bubble tea you're craving",coffee,5,food,true
2,Meal Craving Satisfier,"Let me handle your food cravings",utensils,5,food,true
3,Grocery Runner,"Need groceries? I've got you covered",shopping-cart,3,errands,true
4,Heavy Lifting Helper,"Anything heavy that needs moving or reaching",package,2,physical,true
5,"Just Be There Buddy","Just hanging out and doing our own things",users,10,companionship,true
6,Movie Buddy,"Movie time! In-person or online streaming",tv,5,entertainment,true
7,Game Buddy,"Online or board games - your choice!",gamepad-2,5,entertainment,true
8,Parcel Collector,"Collect your Shopee/Lazada parcels",inbox,10,errands,true
9,Custom Request,"Have something else in mind?",star,3,custom,true
```

## Sheet 2: CouponState

Copy this data into the "CouponState" sheet (row 1 is headers):

```csv
couponId,currentClaims,lastUpdated
1,0,2025-01-16T10:00:00Z
2,0,2025-01-16T10:00:00Z
3,0,2025-01-16T10:00:00Z
4,0,2025-01-16T10:00:00Z
5,0,2025-01-16T10:00:00Z
6,0,2025-01-16T10:00:00Z
7,0,2025-01-16T10:00:00Z
8,0,2025-01-16T10:00:00Z
9,0,2025-01-16T10:00:00Z
```

## Sheet 3: RequestHistory

Create a third sheet named "RequestHistory" (row 1 is headers):

```csv
id,couponId,title,details,timestamp,redeemedBy
```

**Note**: This sheet will be populated automatically when users redeem coupons. You don't need to add any initial data - just the headers.

## Instructions

1. **Create a new Google Sheet** at https://sheets.google.com
2. **Rename the first sheet** to "Coupons" (double-click the tab name)
3. **Copy the CSV data above** for Coupons and paste it starting at cell A1
4. **Create a second sheet** by clicking the "+" icon at the bottom
5. **Rename it to "CouponState"**
6. **Copy the CSV data above** for CouponState and paste it starting at cell A1
7. **Create a third sheet** by clicking the "+" icon at the bottom
8. **Rename it to "RequestHistory"**
9. **Copy the headers above** for RequestHistory and paste it starting at cell A1 (no data needed)
10. **Get the Spreadsheet ID** from the URL (the long string between `/d/` and `/edit`)
11. **Add the Spreadsheet ID** to your `.env` file as `VITE_GOOGLE_SHEETS_SPREADSHEET_ID`

## Example URL and ID

If your sheet URL is:
`https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`

The Spreadsheet ID is:
`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Google Sheets API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google Sheets API"
4. Create credentials -> API Key
5. Copy the API key and add it to your `.env` file as `VITE_GOOGLE_SHEETS_API_KEY`

**Note**: With just an API key, you can only read public sheets. To update claim counts, you'll need to set up OAuth2 authentication or make the sheet publicly readable (anyone with the link can view).