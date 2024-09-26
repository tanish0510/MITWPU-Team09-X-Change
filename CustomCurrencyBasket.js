import React, { useState } from 'react';
import axios from 'axios';

const CustomCurrencyBasket = () => {
  const [baseCurrency, setBaseCurrency] = useState('');
  const [basketItems, setBasketItems] = useState([{ currency: '', weight: '' }]);
  const [result, setResult] = useState('');

  const addBasketItem = () => {
    setBasketItems([...basketItems, { currency: '', weight: '' }]);
  };

  const removeBasketItem = (index) => {
    const updatedItems = basketItems.filter((_, i) => i !== index);
    setBasketItems(updatedItems);
  };

  const handleBasketChange = (index, field, value) => {
    const updatedItems = basketItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setBasketItems(updatedItems);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    const basket = basketItems.map(item => ({
      currency: item.currency,
      weight: parseFloat(item.weight) || 0
    }));

    axios.post('http://localhost:5000/api/exchangeRates/basket', {
      basket,
      baseCurrency
    })
      .then(response => {
        setResult(`Aggregate Value: ${response.data.aggregateValue}`);
      })
      .catch(error => {
        setResult(`Error: ${error.response.data.error}`);
      });
  };

  return (
    <div>
      <h1>Custom Currency Basket</h1>
      <form onSubmit={handleSubmit} id="basketForm">
        <select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)} required>
          <option value="">Select Base Currency</option>
          <option value="USD">USD</option>
          {/* Add other base currencies as needed */}
        </select>
        {basketItems.map((item, index) => (
          <div key={index} className="basketItem">
            <select
              value={item.currency}
              onChange={(e) => handleBasketChange(index, 'currency', e.target.value)}
              required
            >
              <option value="">Select Currency</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              {/* Add more currency options as needed */}
            </select>
            <input
              type="number"
              value={item.weight}
              onChange={(e) => handleBasketChange(index, 'weight', e.target.value)}
              placeholder="Weight (%)"
              required
              min="0"
              max="100"
            />
            <button type="button" onClick={() => removeBasketItem(index)}>❌</button>
          </div>
        ))}
        <button type="button" onClick={addBasketItem}>Add Item</button>
        <button type="submit">Submit</button>
      </form>
      <div id="result">{result}</div>
    </div>
  );
};

export default CustomCurrencyBasket;
