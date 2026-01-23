# 🚀 How to View the Dashboard

## Quick Links

### Option 1: Direct Browser Access (Easiest)
1. Download the repository as a ZIP file
2. Extract the ZIP file to your computer
3. Navigate to the extracted folder
4. Double-click `index.html` to open in your default browser

**Direct file path after extraction:**
```
data-visualization-dashboard/index.html
```

### Option 2: Using Raw GitHub (No Download Needed)
1. Right-click this link: [View index.html](https://raw.githubusercontent.com/ChaseAMathis-droid/data-visualization-dashboard/main/index.html)
2. Select "Save Link As..." or "Save Target As..."
3. Save the file to your computer (keep the name as `index.html`)
4. Also download the other required files to the same folder:
   - [dashboard.js](https://raw.githubusercontent.com/ChaseAMathis-droid/data-visualization-dashboard/main/dashboard.js)
   - [styles.css](https://raw.githubusercontent.com/ChaseAMathis-droid/data-visualization-dashboard/main/styles.css)
   - [sales_data.csv](https://raw.githubusercontent.com/ChaseAMathis-droid/data-visualization-dashboard/main/data/sales_data.csv) (save in a `data` subfolder)
5. Open `index.html` in your browser

### Option 3: GitHub Pages (Live Demo)
**URL:** `https://ChaseAMathis-droid.github.io/data-visualization-dashboard/`

*Note: GitHub Pages needs to be enabled in repository settings for this to work.*

### Option 4: Local Web Server (Recommended for Development)
If you have Python installed:

```bash
# Clone the repository
git clone https://github.com/ChaseAMathis-droid/data-visualization-dashboard.git
cd data-visualization-dashboard

# Start Python web server
python -m http.server 8000

# Open in browser
# Visit: http://localhost:8000
```

Alternative with Node.js:
```bash
# Install http-server globally (one time only)
npm install -g http-server

# Run from the repository folder
http-server

# Open in browser
# Visit: http://localhost:8080
```

## 📱 Browser Compatibility

The dashboard works best in:
- ✅ Google Chrome (recommended)
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari
- ❌ Internet Explorer (not supported)

## 🎯 What You'll See

Once opened, you'll see:
1. **KPI Cards** at the top showing Total Sales, Profit, Units, and Margin
2. **Interactive Filters** for Date Range, Category, and Region
3. **Line Chart** showing sales trends over time
4. **Bar Chart** with sales by category
5. **Heat Map** displaying regional performance
6. **Donut Chart** of top products
7. **Data Table** with all transactions

## 💡 Tips

- **Filters**: Use the dropdown menus at the top to filter data
- **Drill-Down**: Click on chart elements for detailed information
- **Tooltips**: Hover over chart elements to see values
- **Reset**: Click "Reset Filters" to return to the full dataset
- **Mobile**: The dashboard is responsive and works on tablets and phones

## 🐛 Troubleshooting

**If the dashboard doesn't load:**
1. Check that all files are in the correct location
2. Ensure the `data` folder contains `sales_data.csv`
3. Try using a local web server instead of opening the file directly
4. Check your browser's console (F12) for any errors

**If you see CORS errors:**
- This means you need to use a web server (Option 4 above)
- Opening `index.html` directly may not work in some browsers due to security restrictions

## 📧 Need Help?

If you encounter issues viewing the dashboard, please check:
1. That you have all required files (index.html, dashboard.js, styles.css, data/sales_data.csv)
2. That you're using a modern browser
3. That JavaScript is enabled in your browser
