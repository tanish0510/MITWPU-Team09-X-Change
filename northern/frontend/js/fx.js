document.getElementById('fxForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const currency = document.getElementById('currency').value.toUpperCase();
    const date = document.getElementById('date').value;
    const resultDiv = document.getElementById('fxResult');

    // Clear previous results
    resultDiv.innerHTML = '';

    // Validate input
    if (!currency || !date) {
        resultDiv.innerHTML = '<p>Please enter both currency and date.</p>';
        return;
    }

    // Fetch exchange rates from the API
    fetch(`http://localhost:5000/api/exchangeRates/fx/${currency}/${date}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
            } else {
                let ratesHtml = `<h3>Exchange Rates on ${date} (Base: ${currency})</h3>`;
                ratesHtml += '<ul>';
                for (const [curr, rate] of Object.entries(data.rates)) {
                    ratesHtml += `<li>${curr}: ${rate}</li>`;
                }
                ratesHtml += '</ul>';
                resultDiv.innerHTML = ratesHtml;
            }
        })
        .catch(error => {
            resultDiv.innerHTML = `<p>Failed to fetch data. Please try again later.</p>`;
            console.error('Error fetching exchange rates:', error);
        });
});
