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
    const rates = await fetchExchangeRates(currency, period, startDate, endDate);

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

    // Create an array of line colors based on risk levels
    const lineColors = [];
    for (let i = 1; i < data.length; i++) {
        if (riskLevels[i - 1] === 'Low') {
            lineColors.push('rgba(75, 192, 192, 1)'); // Green for Low risk
        } else if (riskLevels[i - 1] === 'Medium') {
            lineColors.push('rgba(255, 206, 86, 1)'); // Yellow for Medium risk
        } else {
            lineColors.push('rgba(255, 99, 132, 1)'); // Red for High risk
        }
    }

    const ctx = document.getElementById('exchangeRateChart').getContext('2d');

    if (window.myChart) {
        window.myChart.destroy(); // Clear previous chart if it exists
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Exchange Rate (${currency})`,
                data: data,
                borderColor: lineColors, // Apply colors based on risk levels
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointBackgroundColor: lineColors // Point colors also based on risk
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const risk = riskLevels[tooltipItem.dataIndex - 1];
                            return `Rate: ${tooltipItem.raw}, Risk: ${risk}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Exchange Rate'
                    }
                }
            }
        }
    });
}

document.getElementById('period').addEventListener('change', function() {
    const customDates = document.getElementById('custom-dates');
    if (this.value === 'custom') {
        customDates.style.display = 'block';
    } else {
        customDates.style.display = 'none';
    }
});

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
