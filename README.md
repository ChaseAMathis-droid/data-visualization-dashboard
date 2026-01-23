# 📊 Interactive Data Visualization Dashboard

A modern, web-based interactive dashboard for visualizing complex datasets with executive-level insights. This dashboard provides comprehensive data analysis capabilities including multiple chart types, dynamic filtering, drill-down interactions, and calculated fields.

## 🔗 Quick Access

**To view the dashboard:**

1. **GitHub Pages (Live Demo)**: 
   - **URL:** `https://ChaseAMathis-droid.github.io/data-visualization-dashboard/`
   - Automatically deploys from this branch
   
2. **Locally**: 
   - Download the repository and open `index.html` directly in your browser
   - Or use the [Raw GitHub link](https://raw.githubusercontent.com/ChaseAMathis-droid/data-visualization-dashboard/copilot/build-tableau-dashboard/index.html) (right-click → Save As → open the saved file)

3. **Via Local Server** (recommended for development):
   ```bash
   # Clone the repository
   git clone https://github.com/ChaseAMathis-droid/data-visualization-dashboard.git
   cd data-visualization-dashboard
   
   # Start a web server
   python -m http.server 8000
   
   # Open in browser: http://localhost:8000
   ```

## ✨ Features

### 📈 Visualizations
- **Line Chart**: Sales and profit trends over time with month-by-month breakdown
- **Bar Chart**: Category-wise sales and profit comparison
- **Heat Map**: Regional performance visualization with color-coded intensity
- **Donut Chart**: Top 5 products by profit distribution
- **KPI Cards**: Real-time metrics with trend indicators

### 🎯 Interactive Features
- **Dynamic Filters**: Filter by date range (quarters), category, and region
- **Drill-Down**: Click charts to explore detailed data
- **Tooltips**: Hover over any chart element for detailed information
- **Responsive Data Table**: Sortable and interactive data grid
- **Calculated Fields**: 
  - Profit margins
  - Trend indicators (positive/negative)
  - Average price per unit
  - Period-over-period comparisons

### 💼 Executive-Ready Design
- Clean, modern interface optimized for readability
- Professional color schemes following data visualization best practices
- Responsive layout that works on desktop and mobile
- Clear visual hierarchy and labeling
- Performance-optimized rendering

## 🚀 Quick Start

### Option 1: Open Locally
1. Clone or download this repository
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. The dashboard will automatically load the sample data from `data/sales_data.csv`

### Option 2: Use a Local Server
For best results, serve the files using a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📁 Project Structure

```
data-visualization-dashboard/
├── index.html          # Main dashboard HTML
├── styles.css          # Responsive CSS styling
├── dashboard.js        # Interactive JavaScript logic
├── data/
│   └── sales_data.csv  # Sample sales dataset
└── README.md           # This file
```

## 📊 Data Source

The dashboard connects to a CSV data source (`data/sales_data.csv`) with the following structure:

```csv
date,category,product,sales,profit,region,units_sold
2023-01-15,Electronics,Laptop,45000,12000,North,150
...
```

### Using Your Own Data

To use your own data:

1. **CSV Format**: Ensure your CSV file has these columns:
   - `date` (YYYY-MM-DD format)
   - `category` (product category)
   - `product` (product name)
   - `sales` (sales amount in dollars)
   - `profit` (profit amount in dollars)
   - `region` (geographic region)
   - `units_sold` (number of units)

2. **Replace Data**: Replace `data/sales_data.csv` with your data file
3. **Refresh**: Reload the dashboard in your browser

### SQL Data Source Support

To connect to a SQL database, you would need to:
1. Set up a backend API (Node.js, Python Flask, etc.)
2. Create an endpoint that queries your database
3. Modify `dashboard.js` to fetch from your API endpoint instead of the CSV file

Example modification for API connection:
```javascript
async function loadData() {
    const response = await fetch('/api/sales-data');
    rawData = await response.json();
    filteredData = [...rawData];
}
```

## 🎨 Data Visualization Best Practices Implemented

1. **Color Consistency**: Uses a consistent color palette throughout
2. **Clear Labels**: All charts have descriptive titles and axis labels
3. **Executive Summary**: KPI cards at the top provide quick insights
4. **Interactive Exploration**: Multiple levels of drill-down for detailed analysis
5. **Context**: Tooltips provide additional context on hover
6. **Responsive Design**: Adapts to different screen sizes
7. **Accessibility**: High contrast ratios and readable fonts
8. **Performance**: Optimized for fast loading and smooth interactions

## 🔧 Customization

### Changing Colors
Edit `styles.css` to modify the color scheme:
```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adding More Filters
Add new filter dropdowns in `index.html` and update the `applyFilters()` function in `dashboard.js`.

### Custom Calculations
Add calculated fields in the `updateKPIs()` function:
```javascript
const customMetric = filteredData.reduce((sum, item) => {
    return sum + (item.sales * item.profit / item.units_sold);
}, 0);
```

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (not supported)

## 🛠️ Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with Grid and Flexbox
- **JavaScript (ES6+)**: Interactive functionality and data manipulation
- **SVG**: Custom charts rendered with native SVG (no external dependencies)
- **CSV Parsing**: Built-in CSV data loading

## 📈 Key Metrics & KPIs

The dashboard automatically calculates:
- **Total Sales**: Sum of all sales in the filtered period
- **Total Profit**: Sum of all profits
- **Units Sold**: Total quantity sold
- **Profit Margin**: (Profit / Sales) × 100
- **Trends**: Period-over-period growth rates

## 🎯 Use Cases

- **Sales Performance Analysis**: Track sales across products, categories, and regions
- **Executive Reporting**: Quick insights for decision-makers
- **Trend Analysis**: Identify patterns and seasonal variations
- **Regional Comparison**: Compare performance across different markets
- **Product Analysis**: Identify top-performing products

## 🤝 Contributing

To enhance this dashboard:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available for educational and commercial use.

## 📧 Support

For questions or issues, please open an issue in the repository.

---

**Built with ❤️ for data-driven decision making**
