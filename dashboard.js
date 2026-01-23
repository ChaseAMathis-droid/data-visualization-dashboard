// Interactive Data Visualization Dashboard
// Pure JavaScript implementation with SVG charts (no external dependencies)

let rawData = [];
let filteredData = [];

// Load and initialize dashboard
async function initDashboard() {
    try {
        await loadData();
        initializeFilters();
        updateDashboard();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        alert('Error loading data. Please check the console for details.');
    }
}

// Load CSV data
async function loadData() {
    const response = await fetch('data/sales_data.csv');
    const csvText = await response.text();
    rawData = parseCSV(csvText);
    filteredData = [...rawData];
}

// Parse CSV data
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return {
            date: values[0],
            category: values[1],
            product: values[2],
            sales: parseFloat(values[3]),
            profit: parseFloat(values[4]),
            region: values[5],
            units_sold: parseFloat(values[6])
        };
    });
}

// Initialize filters
function initializeFilters() {
    document.getElementById('dateFilter').addEventListener('change', applyFilters);
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('regionFilter').addEventListener('change', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
}

// Apply filters
function applyFilters() {
    const dateFilter = document.getElementById('dateFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const regionFilter = document.getElementById('regionFilter').value;
    
    filteredData = rawData.filter(item => {
        // Date filter (by quarter)
        let dateMatch = true;
        if (dateFilter !== 'all') {
            const month = parseInt(item.date.split('-')[1]);
            if (dateFilter === 'Q1') dateMatch = month >= 1 && month <= 3;
            else if (dateFilter === 'Q2') dateMatch = month >= 4 && month <= 6;
            else if (dateFilter === 'Q3') dateMatch = month >= 7 && month <= 9;
            else if (dateFilter === 'Q4') dateMatch = month >= 10 && month <= 12;
        }
        
        // Category filter
        const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;
        
        // Region filter
        const regionMatch = regionFilter === 'all' || item.region === regionFilter;
        
        return dateMatch && categoryMatch && regionMatch;
    });
    
    updateDashboard();
}

// Reset filters
function resetFilters() {
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('regionFilter').value = 'all';
    filteredData = [...rawData];
    updateDashboard();
}

// Update entire dashboard
function updateDashboard() {
    updateKPIs();
    updateLineChart();
    updateBarChart();
    updateHeatMap();
    updateProductChart();
    updateDataTable();
}

// Calculate and update KPIs with trends
function updateKPIs() {
    const totalSales = filteredData.reduce((sum, item) => sum + item.sales, 0);
    const totalProfit = filteredData.reduce((sum, item) => sum + item.profit, 0);
    const totalUnits = filteredData.reduce((sum, item) => sum + item.units_sold, 0);
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales * 100) : 0;
    
    // Calculate trends (compare to previous period)
    const salesTrend = calculateTrend('sales');
    const profitTrend = calculateTrend('profit');
    const unitsTrend = calculateTrend('units_sold');
    const marginTrend = calculateTrend('margin');
    
    document.getElementById('totalSales').textContent = formatCurrency(totalSales);
    document.getElementById('totalProfit').textContent = formatCurrency(totalProfit);
    document.getElementById('totalUnits').textContent = formatNumber(totalUnits);
    document.getElementById('profitMargin').textContent = profitMargin.toFixed(1) + '%';
    
    updateTrendIndicator('salesTrend', salesTrend);
    updateTrendIndicator('profitTrend', profitTrend);
    updateTrendIndicator('unitsTrend', unitsTrend);
    updateTrendIndicator('marginTrend', marginTrend);
}

// Calculate trend percentage
function calculateTrend(metric) {
    if (filteredData.length === 0) return 0;
    
    const midPoint = Math.floor(filteredData.length / 2);
    const firstHalf = filteredData.slice(0, midPoint);
    const secondHalf = filteredData.slice(midPoint);
    
    let firstValue, secondValue;
    
    if (metric === 'margin') {
        const firstSales = firstHalf.reduce((sum, item) => sum + item.sales, 0);
        const firstProfit = firstHalf.reduce((sum, item) => sum + item.profit, 0);
        const secondSales = secondHalf.reduce((sum, item) => sum + item.sales, 0);
        const secondProfit = secondHalf.reduce((sum, item) => sum + item.profit, 0);
        firstValue = firstSales > 0 ? (firstProfit / firstSales * 100) : 0;
        secondValue = secondSales > 0 ? (secondProfit / secondSales * 100) : 0;
    } else {
        firstValue = firstHalf.reduce((sum, item) => sum + item[metric], 0);
        secondValue = secondHalf.reduce((sum, item) => sum + item[metric], 0);
    }
    
    if (firstValue === 0) return 0;
    return ((secondValue - firstValue) / firstValue * 100);
}

// Update trend indicator
function updateTrendIndicator(elementId, trend) {
    const element = document.getElementById(elementId);
    const trendValue = trend.toFixed(1);
    element.textContent = (trend >= 0 ? '+' : '') + trendValue + '%';
    element.className = 'kpi-trend ' + (trend >= 0 ? 'positive' : 'negative');
}

// Update line chart - Sales trend over time
function updateLineChart() {
    const container = document.getElementById('lineChart');
    
    // Group data by month
    const monthlyData = {};
    filteredData.forEach(item => {
        const month = item.date.substring(0, 7); // YYYY-MM
        if (!monthlyData[month]) {
            monthlyData[month] = { sales: 0, profit: 0 };
        }
        monthlyData[month].sales += item.sales;
        monthlyData[month].profit += item.profit;
    });
    
    const months = Object.keys(monthlyData).sort();
    const salesData = months.map(m => monthlyData[m].sales);
    const profitData = months.map(m => monthlyData[m].profit);
    
    // Create SVG line chart
    const width = 600;
    const height = 300;
    const padding = 50;
    
    const maxValue = Math.max(...salesData, ...profitData);
    const scaleX = (width - 2 * padding) / (months.length - 1 || 1);
    const scaleY = (height - 2 * padding) / maxValue;
    
    let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Draw grid lines
    for (let i = 0; i <= 5; i++) {
        const y = height - padding - (i * (height - 2 * padding) / 5);
        svg += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e0e0e0" stroke-width="1"/>`;
        svg += `<text x="${padding - 10}" y="${y + 5}" fill="#666" text-anchor="end" font-size="12">${Math.round(maxValue * i / 5 / 1000)}K</text>`;
    }
    
    // Draw sales line
    let salesPath = `M `;
    months.forEach((month, i) => {
        const x = padding + i * scaleX;
        const y = height - padding - salesData[i] * scaleY;
        salesPath += `${x},${y} `;
    });
    svg += `<path d="${salesPath}" fill="none" stroke="#667eea" stroke-width="3"/>`;
    
    // Draw sales points
    months.forEach((month, i) => {
        const x = padding + i * scaleX;
        const y = height - padding - salesData[i] * scaleY;
        svg += `<circle cx="${x}" cy="${y}" r="5" fill="#667eea" class="chart-point" data-label="${formatMonth(month)}: ${formatCurrency(salesData[i])}" onclick="drillDownByMonth('${month}')"/>`;
    });
    
    // Draw profit line
    let profitPath = `M `;
    months.forEach((month, i) => {
        const x = padding + i * scaleX;
        const y = height - padding - profitData[i] * scaleY;
        profitPath += `${x},${y} `;
    });
    svg += `<path d="${profitPath}" fill="none" stroke="#28a745" stroke-width="3"/>`;
    
    // Draw profit points
    months.forEach((month, i) => {
        const x = padding + i * scaleX;
        const y = height - padding - profitData[i] * scaleY;
        svg += `<circle cx="${x}" cy="${y}" r="5" fill="#28a745" class="chart-point" data-label="${formatMonth(month)}: ${formatCurrency(profitData[i])}" onclick="drillDownByMonth('${month}')"/>`;
    });
    
    // Draw x-axis labels
    months.forEach((month, i) => {
        const x = padding + i * scaleX;
        if (i % Math.ceil(months.length / 6) === 0) {
            svg += `<text x="${x}" y="${height - padding + 20}" fill="#666" text-anchor="middle" font-size="11">${formatMonth(month)}</text>`;
        }
    });
    
    // Legend
    svg += `<rect x="${width - 150}" y="20" width="15" height="3" fill="#667eea"/>`;
    svg += `<text x="${width - 130}" y="25" fill="#333" font-size="12">Sales</text>`;
    svg += `<rect x="${width - 150}" y="35" width="15" height="3" fill="#28a745"/>`;
    svg += `<text x="${width - 130}" y="40" fill="#333" font-size="12">Profit</text>`;
    
    svg += '</svg>';
    
    container.innerHTML = svg;
    
    // Add tooltips
    addTooltips(container);
}

// Update bar chart - Sales by category
function updateBarChart() {
    const container = document.getElementById('barChart');
    
    // Group data by category
    const categoryData = {};
    filteredData.forEach(item => {
        if (!categoryData[item.category]) {
            categoryData[item.category] = { sales: 0, profit: 0 };
        }
        categoryData[item.category].sales += item.sales;
        categoryData[item.category].profit += item.profit;
    });
    
    const categories = Object.keys(categoryData);
    const salesData = categories.map(c => categoryData[c].sales);
    
    // Create SVG bar chart
    const width = 600;
    const height = 300;
    const padding = 60;
    const barWidth = (width - 2 * padding) / categories.length / 2.5;
    
    const maxValue = Math.max(...salesData);
    const scaleY = (height - 2 * padding) / maxValue;
    
    let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Draw grid lines
    for (let i = 0; i <= 5; i++) {
        const y = height - padding - (i * (height - 2 * padding) / 5);
        svg += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e0e0e0" stroke-width="1"/>`;
        svg += `<text x="${padding - 10}" y="${y + 5}" fill="#666" text-anchor="end" font-size="12">${Math.round(maxValue * i / 5 / 1000)}K</text>`;
    }
    
    // Draw bars
    categories.forEach((category, i) => {
        const x = padding + (i * (width - 2 * padding) / categories.length) + 10;
        const barHeight = salesData[i] * scaleY;
        const y = height - padding - barHeight;
        
        svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#667eea" rx="5" class="chart-bar" data-label="${category}: ${formatCurrency(salesData[i])}" onclick="drillDownByCategory('${category}')"/>`;
        svg += `<text x="${x + barWidth / 2}" y="${height - padding + 20}" fill="#666" text-anchor="middle" font-size="11">${category}</text>`;
    });
    
    svg += '</svg>';
    
    container.innerHTML = svg;
    
    // Add tooltips
    addTooltips(container);
}

// Update heat map - Regional performance
function updateHeatMap() {
    const heatMapDiv = document.getElementById('heatMap');
    
    // Group data by region
    const regionData = {};
    filteredData.forEach(item => {
        if (!regionData[item.region]) {
            regionData[item.region] = { sales: 0, units: 0 };
        }
        regionData[item.region].sales += item.sales;
        regionData[item.region].units += item.units_sold;
    });
    
    const regions = Object.keys(regionData);
    const maxSales = Math.max(...regions.map(r => regionData[r].sales));
    
    // Color scale for heat map
    const getHeatColor = (value, max) => {
        const intensity = value / max;
        if (intensity > 0.75) return '#d32f2f';      // Red - High
        if (intensity > 0.5) return '#f57c00';       // Orange - Medium-High
        if (intensity > 0.25) return '#fbc02d';      // Yellow - Medium
        return '#388e3c';                             // Green - Low
    };
    
    heatMapDiv.innerHTML = '';
    regions.forEach(region => {
        const cell = document.createElement('div');
        cell.className = 'heat-cell';
        cell.style.backgroundColor = getHeatColor(regionData[region].sales, maxSales);
        cell.innerHTML = `
            <h4>${region}</h4>
            <p>${formatCurrency(regionData[region].sales)}</p>
            <small>${formatNumber(regionData[region].units)} units</small>
        `;
        cell.onclick = () => drillDownByRegion(region);
        heatMapDiv.appendChild(cell);
    });
}

// Update product chart - Top products by profit
function updateProductChart() {
    const container = document.getElementById('productChart');
    
    // Group data by product
    const productData = {};
    filteredData.forEach(item => {
        if (!productData[item.product]) {
            productData[item.product] = { profit: 0, sales: 0 };
        }
        productData[item.product].profit += item.profit;
        productData[item.product].sales += item.sales;
    });
    
    // Sort by profit and take top 5
    const products = Object.keys(productData)
        .sort((a, b) => productData[b].profit - productData[a].profit)
        .slice(0, 5);
    const profitData = products.map(p => productData[p].profit);
    
    // Create SVG donut chart
    const width = 400;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 80;
    const innerRadius = 45;
    
    const total = profitData.reduce((a, b) => a + b, 0);
    const colors = ['#667eea', '#764ba2', '#28a745', '#fbc02d', '#f57c00'];
    
    let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    let currentAngle = -90;
    products.forEach((product, i) => {
        const percentage = profitData[i] / total;
        const angle = percentage * 360;
        const endAngle = currentAngle + angle;
        
        const x1 = centerX + radius * Math.cos(currentAngle * Math.PI / 180);
        const y1 = centerY + radius * Math.sin(currentAngle * Math.PI / 180);
        const x2 = centerX + radius * Math.cos(endAngle * Math.PI / 180);
        const y2 = centerY + radius * Math.sin(endAngle * Math.PI / 180);
        
        const x3 = centerX + innerRadius * Math.cos(endAngle * Math.PI / 180);
        const y3 = centerY + innerRadius * Math.sin(endAngle * Math.PI / 180);
        const x4 = centerX + innerRadius * Math.cos(currentAngle * Math.PI / 180);
        const y4 = centerY + innerRadius * Math.sin(currentAngle * Math.PI / 180);
        
        const largeArc = angle > 180 ? 1 : 0;
        
        const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
        
        svg += `<path d="${pathData}" fill="${colors[i]}" class="chart-segment" data-label="${product}: ${formatCurrency(profitData[i])} (${(percentage * 100).toFixed(1)}%)"/>`;
        
        currentAngle = endAngle;
    });
    
    // Legend
    products.forEach((product, i) => {
        const y = 30 + i * 25;
        svg += `<rect x="10" y="${y}" width="15" height="15" fill="${colors[i]}"/>`;
        svg += `<text x="30" y="${y + 12}" fill="#333" font-size="12">${product}</text>`;
    });
    
    svg += '</svg>';
    
    container.innerHTML = svg;
    
    // Add tooltips
    addTooltips(container);
}

// Add tooltip functionality
function addTooltips(container) {
    const elements = container.querySelectorAll('[data-label]');
    elements.forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'chart-tooltip';
            tooltip.textContent = this.getAttribute('data-label');
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.fontSize = '13px';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.zIndex = '1000';
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            
            this._tooltip = tooltip;
        });
        el.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}

// Update data table
function updateDataTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    // Sort by date descending
    const sortedData = [...filteredData].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    sortedData.forEach((item, index) => {
        const row = tbody.insertRow();
        row.onclick = () => showRowDetails(item);
        
        const margin = ((item.profit / item.sales) * 100).toFixed(1);
        
        row.innerHTML = `
            <td>${formatDate(item.date)}</td>
            <td>${item.category}</td>
            <td>${item.product}</td>
            <td>${formatCurrency(item.sales)}</td>
            <td>${formatCurrency(item.profit)}</td>
            <td>${item.region}</td>
            <td>${formatNumber(item.units_sold)}</td>
            <td>${margin}%</td>
        `;
    });
}

// Drill-down functions
function drillDownByMonth(month) {
    alert(`Drilling down into data for ${formatMonth(month)}.\n\nIn a full implementation, this would show detailed daily breakdown and individual transactions.`);
}

function drillDownByCategory(category) {
    const products = [...new Set(filteredData
        .filter(item => item.category === category)
        .map(item => item.product))];
    alert(`Drilling down into ${category}.\n\nProducts: ${products.join(', ')}\n\nClick a product in the table for more details.`);
}

function drillDownByRegion(region) {
    const categories = [...new Set(filteredData
        .filter(item => item.region === region)
        .map(item => item.category))];
    alert(`Drilling down into ${region} region.\n\nCategories: ${categories.join(', ')}`);
}

function showRowDetails(item) {
    const margin = ((item.profit / item.sales) * 100).toFixed(1);
    const avgPrice = (item.sales / item.units_sold).toFixed(2);
    
    alert(`Detailed View:\n\n` +
          `Date: ${formatDate(item.date)}\n` +
          `Category: ${item.category}\n` +
          `Product: ${item.product}\n` +
          `Region: ${item.region}\n\n` +
          `Sales: ${formatCurrency(item.sales)}\n` +
          `Profit: ${formatCurrency(item.profit)}\n` +
          `Units Sold: ${formatNumber(item.units_sold)}\n` +
          `Profit Margin: ${margin}%\n` +
          `Avg Price per Unit: ${formatCurrency(avgPrice)}`);
}

// Utility functions
function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
    });
}

function formatNumber(value) {
    return value.toLocaleString('en-US');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatMonth(monthString) {
    const [year, month] = monthString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
    });
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}
