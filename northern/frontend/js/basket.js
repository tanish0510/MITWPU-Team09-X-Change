document.getElementById('basketForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const baseCurrency = document.getElementById('baseCurrency').value;
    const basketItems = document.querySelectorAll('.basketItem');

    const basket = Array.from(basketItems).map(item => {
        const currency = item.querySelector('.currency').value;
        const weight = parseFloat(item.querySelector('.weight').value);
        return { currency, weight };
    });

    // Send a POST request to the backend
    axios.post('http://localhost:5000/api/exchangeRates/basket', {
        basket: basket,
        baseCurrency: baseCurrency
    })
    .then(response => {
        // Handle success response
        document.getElementById('result').innerText = `Aggregate Value: ${response.data.aggregateValue}`;
    })
    .catch(error => {
        // Handle error response
        document.getElementById('result').innerText = `Error: ${error.response.data.error}`;
    });
});

// Adding the event listener to dynamically add more basket items
document.getElementById('addItem').addEventListener('click', function() {
    const newItem = document.createElement('div');
    newItem.className = 'basketItem';
    newItem.innerHTML = `
        <div>
        <select class="currency" required>
            <option value="">Select Currency</option>
            <option value="DZD">Algerian dinar (DZD)</option>
            <option value="AUD">Australian dollar (AUD)</option>
            <option value="BHD">Bahrain dinar (BHD)</option>
            <option value="VEF">Bolivar Fuerte (VEF)</option>
            <option value="BWP">Botswana pula (BWP)</option>
            <option value="BRL">Brazilian real (BRL)</option>
            <option value="BND">Brunei dollar (BND)</option>
            <option value="CAD">Canadian dollar (CAD)</option>
            <option value="CLP">Chilean peso (CLP)</option>
            <option value="CNY">Chinese yuan (CNY)</option>
            <option value="COP">Colombian peso (COP)</option>
            <option value="CZK">Czech koruna (CZK)</option>
            <option value="DKK">Danish krone (DKK)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="HUF">Hungarian forint (HUF)</option>
            <option value="ISK">Icelandic krona (ISK)</option>
            <option value="INR">Indian rupee (INR)</option>
            <option value="IDR">Indonesian rupiah (IDR)</option>
            <option value="IRR">Iranian rial (IRR)</option>
            <option value="ILS">Israeli New Shekel (ILS)</option>
            <option value="JPY">Japanese yen (JPY)</option>
            <option value="KZT">Kazakhstani tenge (KZT)</option>
            <option value="KRW">Korean won (KRW)</option>
            <option value="KWD">Kuwaiti dinar (KWD)</option>
            <option value="LYD">Libyan dinar (LYD)</option>
            <option value="MYR">Malaysian ringgit (MYR)</option>
            <option value="MUR">Mauritian rupee (MUR)</option>
            <option value="MXN">Mexican peso (MXN)</option>
            <option value="NPR">Nepalese rupee (NPR)</option>
            <option value="NZD">New Zealand dollar (NZD)</option>
            <option value="NOK">Norwegian krone (NOK)</option>
            <option value="OMR">Omani rial (OMR)</option>
            <option value="PKR">Pakistani rupee (PKR)</option>
            <option value="PEN">Peruvian sol (PEN)</option>
            <option value="PHP">Philippine peso (PHP)</option>
            <option value="PLN">Polish zloty (PLN)</option>
            <option value="QAR">Qatari riyal (QAR)</option>
            <option value="RUB">Russian ruble (RUB)</option>
            <option value="SAR">Saudi Arabian riyal (SAR)</option>
            <option value="SGD">Singapore dollar (SGD)</option>
            <option value="ZAR">South African rand (ZAR)</option>
            <option value="LKR">Sri Lankan rupee (LKR)</option>
            <option value="SEK">Swedish krona (SEK)</option>
            <option value="CHF">Swiss franc (CHF)</option>
            <option value="THB">Thai baht (THB)</option>
            <option value="TTD">Trinidadian dollar (TTD)</option>
            <option value="TND">Tunisian dinar (TND)</option>
            <option value="AED">U.A.E. dirham (AED)</option>
            <option value="GBP">U.K. pound (GBP)</option>
            <option value="USD">U.S. dollar (USD)</option>
            <option value="UYU">Uruguayan peso (UYU)</option>
            <option value="VES">Bolivar Soberano (VES)</option>
        </select>
        <input type="number" class="weight" placeholder="Weight (%)" required min="0" max="100">
        <button type="button" class="deleteItem">❌</button>
        </div>
    `;
    document.getElementById('basketItems').appendChild(newItem);

    // Add event listener to the delete button
    newItem.querySelector('.deleteItem').addEventListener('click', function() {
        newItem.remove();
    });
});
