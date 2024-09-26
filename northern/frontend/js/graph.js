async function fetchExchangeRates(currency, period, startDate = null, endDate = null) {
    let url = `http://localhost:5000/api/exchangeRates/${currency}/`;
    if (period === 'custom' && startDate && endDate) {
        url += `${startDate}:${endDate}`;
    } else {
        url += period;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return [];
    }
}

async function renderChart(currency, period, startDate, endDate) {
    // Disable button during data fetch
    document.getElementById('fetch-rates').disabled = true;

    const rates = await fetchExchangeRates(currency, period, startDate, endDate);

    // Re-enable button
    document.getElementById('fetch-rates').disabled = false;

    if (rates.length === 0) {
        console.error('No rates available to render the chart.');
        return;
    }

    const labels = rates.map(rate => new Date(rate.date).toLocaleDateString());
    const data = rates.map(rate => rate.rate);

    // Function to calculate volatility and risk
    const calculateVolatilityAndRisk = (data) => {
        let volatility = [];
        let riskLevels = [];
        for (let i = 1; i < data.length; i++) {
            const percentageChange = ((data[i] - data[i - 1]) / data[i - 1]) * 100;
            volatility.push(Math.abs(percentageChange));

            // Assign risk levels based on percentage change
            if (Math.abs(percentageChange) <= 1) {
                riskLevels.push('Low');
            } else if (Math.abs(percentageChange) > 1 && Math.abs(percentageChange) <= 3) {
                riskLevels.push('Medium');
            } else {
                riskLevels.push('High');
            }
        }
        return { volatility, riskLevels };
    };

    const { volatility, riskLevels } = calculateVolatilityAndRisk(data);

    // Create gradient colors for each point in the dataset
    const getColorBasedOnRisk = (risk) => {
        if (risk === 'Low') return 'rgba(75, 192, 192, 1)'; // Green
        if (risk === 'Medium') return 'rgba(255, 206, 86, 1)'; // Yellow
        return 'rgba(255, 99, 132, 1)'; // Red
    };

    // Destroy existing chart if it exists
    if (window.myChart) {
        window.myChart.destroy();
    }

    const ctx = document.getElementById('exchangeRateChart').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Exchange Rate (${currency})`,
                data: data,
                borderColor: (ctx) => {
                    const index = ctx.p0DataIndex;
                    return getColorBasedOnRisk(riskLevels[index] || 'Low');
                },
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointBackgroundColor: data.map((_, i) => getColorBasedOnRisk(riskLevels[i - 1] || 'Low')) // Point colors based on risk
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const risk = riskLevels[tooltipItem.dataIndex - 1] || 'Low';
                            return `Rate: ${tooltipItem.raw}, Risk: ${risk}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        color: '#fff' // Set the X-axis title color to white
                    },
                    ticks: {
                        color: '#fff' // Set the X-axis value color to white
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Exchange Rate',
                        color: '#fff' // Set the Y-axis title color to white
                    },
                    ticks: {
                        color: '#fff' // Set the Y-axis value color to white
                    }
                }
            }
        }
    });
}

// Toggle custom date inputs visibility
document.getElementById('period').addEventListener('change', function() {
    const customDates = document.getElementById('custom-dates');
    if (this.value === 'custom') {
        customDates.style.display = 'block';
    } else {
        customDates.style.display = 'none';
    }
});

// Fetch and render the chart on button click
document.getElementById('fetch-rates').addEventListener('click', function() {
    const currency = document.getElementById('currency').value;
    const period = document.getElementById('period').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    renderChart(currency, period, startDate, endDate);
});

// Initial rendering on page load
document.addEventListener('DOMContentLoaded', function() {
    renderChart('USD', '1week');
});