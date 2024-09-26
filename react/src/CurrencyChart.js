import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js';

const CurrencyChart = () => {
  const [currency, setCurrency] = useState('USD');
  const [period, setPeriod] = useState('1week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const chartRef = useRef(null);

  const fetchExchangeRates = async (currency, period, startDate, endDate) => {
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
  };

  const renderChart = async () => {
    const rates = await fetchExchangeRates(currency, period, startDate, endDate);

    if (rates.length === 0) {
      console.error('No rates available to render the chart.');
      return;
    }

    const labels = rates.map(rate => new Date(rate.date).toLocaleDateString());
    const data = rates.map(rate => rate.rate);

    // Calculate volatility and risk levels
    const { volatility, riskLevels } = calculateVolatilityAndRisk(data);

    const lineColors = getLineColors(riskLevels);

    // Render the chart
    if (chartRef.current) {
      chartRef.current.destroy(); // Clear previous chart if it exists
    }

    chartRef.current = new Chart(document.getElementById('exchangeRateChart').getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `Exchange Rate (${currency})`,
          data: data,
          borderColor: lineColors,
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          pointBackgroundColor: lineColors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
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
  };

  const calculateVolatilityAndRisk = (data) => {
    let volatility = [];
    let riskLevels = [];
    for (let i = 1; i < data.length; i++) {
      const percentageChange = ((data[i] - data[i - 1]) / data[i - 1]) * 100;
      volatility.push(Math.abs(percentageChange));
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

  const getLineColors = (riskLevels) => {
    return riskLevels.map(risk => {
      if (risk === 'Low') {
        return 'rgba(75, 192, 192, 1)'; // Green
      } else if (risk === 'Medium') {
        return 'rgba(255, 206, 86, 1)'; // Yellow
      } else {
        return 'rgba(255, 99, 132, 1)'; // Red
      }
    });
  };

  const handleFetchRates = () => {
    renderChart();
  };

  useEffect(() => {
    renderChart(); // Initial rendering on component mount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Clean up on unmount
      }
    };
  }, []);

  return (
    <div>
      <h1>Exchange Rate Graph</h1>
      <canvas id="exchangeRateChart" width="600" height="400"></canvas>
      <div>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          {/* Add other currencies as needed */}
        </select>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="1day">Last 1 Day</option>
          <option value="1week">Last 1 Week</option>
          <option value="1month">Last 1 Month</option>
          <option value="1year">Last 1 Year</option>
          <option value="custom">Custom Date Range</option>
        </select>
        {period === 'custom' && (
          <>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </>
        )}
        <button onClick={handleFetchRates}>Fetch Rates</button>
      </div>
    </div>
  );
};

export default CurrencyChart;
