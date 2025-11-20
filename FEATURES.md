# Atlas 2.0 - Complete Feature List

## 🎯 All Features Working:

### ✅ Core Functionality
- **Auto-detects CSV delimiter** - Works with comma (`,`) and semicolon (`;`) files
- **Filtered/Unfiltered Excel support** - Handles both formats perfectly
- **Stem data caching** - Saves in browser for next session
- **QR code generation** - Shows long resource IDs from stem data

### ✅ QR Code Features
- **Single view navigation** - Navigate one package at a time with arrows
- **Show All view** - NEW! Display all QR codes in a grid at once
- **Toggle between views** - Switch between single and grid view with one click
- **Large, scannable QR codes** - 200-256px for easy scanning

### ✅ HVTS Features
- **DSP grouping** - Automatically groups packages by DSP
- **Individual download** - Download PDF for each DSP
- **Download All PDFs** - NEW! One-click download of all HVTS sheets
- **Auto-delay** - 500ms delay between downloads to avoid browser blocking
- **Wave assignments** - Shows DSP wave numbers
- **Total values** - Calculates total package value per DSP

### ✅ Notifications
- **Chime webhooks** - Sends notifications to all DSPs
- **Success tracking** - Shows how many notifications sent
- **Auto-disable** - Prevents spam by disabling for 30 seconds

## 🚀 How to Use:

### Step 1: Upload Stem Data
- Equipment Details CSV (semicolon delimiter)
- Contains location labels and resource IDs

### Step 2: Upload Search Results
- Regular search results (comma OR semicolon delimiter)
- Auto-detects the delimiter format

### Step 3: Generate Barcodes
- Click "Generate Sort Zone Barcodes"
- Use arrows to navigate one-by-one OR
- Click "Show All" to see all QR codes in a grid

### Step 4: HVTS (Optional)
- Click "Reload Search Results with DSP"
- Upload file WITH DSP assignments
- Click "Generate HVTS Sheets"
- Download individual PDFs OR click "Download All PDFs"

### Step 5: Notifications (Optional)
- Click "Send Chime Notifications"
- Sends alerts to all DSPs with packages

## 🎨 UI Features:

- **Winter theme** - Snow animation and frost colors
- **Responsive design** - Works on all screen sizes
- **Live status indicators** - Shows system active status
- **Real-time clock** - Updates every second
- **Loading animations** - Smooth transitions
- **Hover effects** - Interactive card animations
- **Console logging** - F12 to see detailed debug info

## 📊 View Modes:

### Single View (Default)
- Large QR codes (256px)
- Two QR codes per package (Tracking + Sort Zone)
- Navigation arrows
- Current position counter
- Best for scanning one package at a time

### Grid View (Show All)
- All packages displayed at once
- Slightly smaller QR codes (200px)
- Responsive grid layout
- Best for printing multiple packages
- Best for visual overview of all packages

## 🔧 Technical Details:

- **CSV Parsing**: PapaParse library
- **QR Generation**: QRCode.js library
- **PDF Creation**: jsPDF library
- **Storage**: localStorage for stem data caching
- **Auto-detection**: Smart delimiter detection
- **Error handling**: Comprehensive error messages
- **Debug mode**: Full console logging (press F12)

## 💡 Tips:

1. **First time setup**: Upload stem data once, it will be cached
2. **Console debugging**: Press F12 to see what's happening
3. **Show All for printing**: Use grid view to print all QR codes
4. **Single view for scanning**: Use navigation for picking operations
5. **Download All**: Save time by downloading all HVTS at once

---

**Version**: 2.0 Final  
**Last Updated**: November 2025  
**Developer**: @tbadakar  
**Supporter**: @marwasad
