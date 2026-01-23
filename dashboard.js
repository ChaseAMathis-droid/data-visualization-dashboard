// Interactive Data Visualization Dashboard
// Implements: filters, drill-down, tooltips, calculated fields, and best practices

let rawData = [];
let filteredData = [];
let charts = {};

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
    const ctx = document.getElementById('lineChart').getContext('2d');
    
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
    
    if (charts.lineChart) {
        charts.lineChart.destroy();
    }
    
    charts.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months.map(m => formatMonth(m)),
            datasets: [
                {
                    label: 'Sales',
                    data: salesData,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Profit',
                    data: profitData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        }
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const month = months[index];
                    drillDownByMonth(month);
                }
            }
        }
    });
}

// Update bar chart - Sales by category
function updateBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    
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
    const profitData = categories.map(c => categoryData[c].profit);
    
    if (charts.barChart) {
        charts.barChart.destroy();
    }
    
    charts.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [
                {
                    label: 'Sales',
                    data: salesData,
                    backgroundColor: '#667eea',
                    borderRadius: 8
                },
                {
                    label: 'Profit',
                    data: profitData,
                    backgroundColor: '#28a745',
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        }
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const category = categories[index];
                    drillDownByCategory(category);
                }
            }
        }
    });
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
    const ctx = document.getElementById('productChart').getContext('2d');
    
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
    
    if (charts.productChart) {
        charts.productChart.destroy();
    }
    
    charts.productChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: products,
            datasets: [{
                data: profitData,
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#28a745',
                    '#fbc02d',
                    '#f57c00'
                ],
                borderWidth: 2,
                borderColor: 'white'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            const profit = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((profit / total) * 100).toFixed(1);
                            return context.label + ': ' + formatCurrency(profit) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
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
