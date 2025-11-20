# Atlas 2.0 - Debugging Guide for "No Packages to Process"

## Issue Description
When uploading the formatted CSV file, you're seeing "No packages to process" message.

## What I've Fixed

### 1. Added Comprehensive Console Logging
The updated `scripts.js` now includes detailed console logging at every step:
- When search data is processed
- When barcodes are generated
- When matching stem data with sort zones

### 2. Enhanced Error Messages
Better warnings when:
- No stem data is uploaded
- No matching resource IDs found
- Data processing issues occur

## How to Debug

### Step 1: Open Browser Console
1. Press `F12` on your keyboard
2. Click the "Console" tab
3. Keep this open while using Atlas 2.0

### Step 2: Upload Files and Watch Console
When you upload the Search Results CSV, you'll see:
```
=== Processing Search Data ===
Raw data length: 17
First row raw: {Tracking ID: "AT2202686718", ...}
First row keys: ["Tracking ID", "Sort Zone", ...]
Clean data length: 17
Tracking ID from first row: AT2202686718
Sort Zone from first row: A21-3A
```

### Step 3: Generate Barcodes and Check Logs
When you click "Generate Sort Zone Barcodes", you'll see:
```
=== Generate Barcodes Called ===
stemData exists: true
searchData exists: true
stemData length: 150
searchData length: 17
=== Processing Search Data ===
Item 0: {...}
  Tracking ID found: "AT2202686718"
  Sort Zone found: "A21-3A"
  ✓ Added to packages map
...
=== Packages Map Created ===
Total unique packages: 17
```

## Common Issues & Solutions

### Issue 1: "No packages to process"
**Cause**: No valid tracking IDs found in the CSV
**Check Console For**:
```
Tracking ID found: "undefined" or ""
```
**Solution**: Verify your CSV has a "Tracking ID" column with values

### Issue 2: QR Code shows sort zone instead of long resource ID
**Cause**: No matching stem data for the sort zones
**Check Console For**:
```
⚠ No resourceId found for sort zone: "A21-3A" - using sort zone value
```
**Solution**: 
1. Make sure you've uploaded the Stem Data (Equipment Details) file first
2. Verify the stem data has matching labels for your sort zones
3. Example stem data format:
   ```
   label;resourceId
   A21-3A;DAP8-A21-3A-RESOURCE-ID-12345
   ```

### Issue 3: Stem data not matching
**Cause**: Sort zone format in search data doesn't match stem data labels
**Check Console For**:
```
⚠ No resourceId found for sort zone: "A21-3A"
```
**Solution**: Check that your stem data has the EXACT same format for zone labels

## Expected Behavior

### With Stem Data Uploaded:
**QR Code 1 (Tracking)**: `AT2202686718`
**QR Code 2 (Sort Zone)**: `DAP8-A21-3A-RESOURCE-ID-LONG-CODE-HERE` (the long resource ID from stem data)

### Without Stem Data:
**QR Code 1 (Tracking)**: `AT2202686718`
**QR Code 2 (Sort Zone)**: `A21-3A` (just the sort zone value)

## Test Your Files

### Test with This Command in Console:
After uploading both files, run this in the browser console:
```javascript
console.log('Stem Data:', stemData ? stemData.length + ' rows' : 'NOT LOADED');
console.log('Search Data:', searchData ? searchData.length + ' rows' : 'NOT LOADED');
console.log('First stem entry:', stemData ? stemData[0] : 'N/A');
console.log('First search entry:', searchData ? searchData[0] : 'N/A');
```

## What to Send Me for Help

If you still have issues, open the console (F12), run the test above, and send me:
1. Screenshot of the console output
2. First few lines of your Stem Data CSV file
3. The error messages (if any) shown in red in the console

## File Format Requirements

### Stem Data (Equipment Details):
- **Delimiter**: Semicolon (`;`)
- **Required Columns**: `label`, `resourceId`
- **Example**:
  ```
  label;resourceId
  A21-3A;DAP8-ZONE-A21-3A-RESOURCE-12345678
  A32-2E;DAP8-ZONE-A32-2E-RESOURCE-87654321
  ```

### Search Results:
- **Delimiter**: Comma (`,`)
- **Required Columns**: `Tracking ID`, `Sort Zone`
- **Example**:
  ```
  "Tracking ID","Sort Zone"
  "AT2202686718","A21-3A"
  "AT2202783861","A32-2E"
  ```

---

**Remember**: The console (F12) is your friend! It will tell you exactly what's happening at each step.
