const fs = require('fs');
const csv = require('csv-parser');

const calculateFxTokens = (req, res) => {
    const { currency, date } = req.params;
    const results = [];
    let baseRate = null; // This will store the base rate of the given currency (initially null)
    let matchedColumn = null;
    console.log("herer",currency,date)
    // Step 1: Read the CSV file to fetch the exchange rate for the given currency and date
    fs.createReadStream('../backend/data/exchangeFinal.csv')
        .pipe(csv())
        .on('headers', (headers) => {
            // Step 2: Use regex to search for the column that matches the currency symbol
            const regex = new RegExp(`\\(${currency}\\)`, 'i'); // Matches anything like (RUB), (USD), etc.
            matchedColumn = headers.find((header) => regex.test(header));
        })
        .on('data', (data) => {
            if (data['Date'] === date) { // Match the specific date
                baseRate = parseFloat(data[matchedColumn]); // Fetch the exchange rate for the given currency
                if (isNaN(baseRate)) {
                    return res.status(404).json({ error: `No rate found for ${currency} on ${date}` });
                }

                // Step 3: Calculate rates for all currencies using the base rate
                const allRates = {};
                Object.keys(data).forEach((key) => {
                    if (key !== 'Date' && key !== matchedColumn) { // Exclude date and the currency itself
                        const rate = parseFloat(data[key]);
                        if (!isNaN(rate)) {
                            allRates[key] = (rate / baseRate).toFixed(6); // Adjust rate by base currency
                        }
                    }
                });

                results.push({ date, baseCurrency: currency, rates: allRates });
            }
        })
        .on('end', () => {
            if (results.length === 0) {
                res.status(404).json({ error: `No data found for currency ${currency} on ${date}` });
            } else {
                res.json(results[0]); // Return only the first (and only) result
            }
        })
        .on('error', (err) => {
            res.status(500).json({ error: 'Error reading CSV file' });
        });
};

module.exports = { calculateFxTokens };
