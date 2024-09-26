import React, { useState } from "react";
import Papa from "papaparse";
import Select from "react-select";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the Calendar CSS
import './App.css'; // Import your CSS file

function App() {
  const [currencyData, setCurrencyData] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);
  const [convertedRates, setConvertedRates] = useState([]);
  const [sortOption, setSortOption] = useState(null); // State for sorting option

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const data = results.data;
          const uniqueDates = [...new Set(data.map(row => row.Date))];
          setDates(uniqueDates);
          setCurrencyData(data);
        }
      });
    }
  };

  const convertRates = (baseCurrency, formattedDate) => {
    if (!formattedDate) return;

    const selectedRow = currencyData.find(row => row.Date === formattedDate);

    if (selectedRow) {
      const baseRate = parseFloat(selectedRow[baseCurrency]);

      // Ensure the base currency has a rate of 1.0000
      const newRates = [{
        Currency: baseCurrency,
        ConvertedRate: "1.0000",
      }];

      // Add all other currencies to the list, including 0 or invalid rates
      Object.keys(selectedRow)
        .filter(key => key !== 'Date' && key !== baseCurrency && key.trim() !== '') // Exclude date, base currency, and empty keys
        .forEach(currency => {
          const rate = parseFloat(selectedRow[currency]);
          const convertedRate = isNaN(rate) || rate === 0
            ? "Invalid" // Mark invalid rates
            : (rate / baseRate).toFixed(4); // Compute conversion rate

          // Only add if the currency has a valid name
          if (currency.trim() !== '') {
            newRates.push({
              Currency: currency,
              ConvertedRate: convertedRate,
            });
          }
        });

      setConvertedRates(newRates);
    } else {
      console.log("No data found for the selected date."); // Debugging
    }
  };

  const sortOptions = [
    { value: 'name', label: 'Name of Currency' },
    { value: 'rate', label: 'Conversion Rate Value' }
  ];

  const handleSortChange = (option) => {
    setSortOption(option);
    if (convertedRates.length > 0) {
      let sortedRates = [...convertedRates];
      if (option.value === 'name') {
        sortedRates.sort((a, b) => a.Currency.localeCompare(b.Currency)); // Sort by currency name
      } else if (option.value === 'rate') {
        sortedRates.sort((a, b) => parseFloat(a.ConvertedRate) - parseFloat(b.ConvertedRate)); // Sort by conversion rate
      }
      setConvertedRates(sortedRates);
    }
  };

  const dateOptions = dates.map(date => ({ value: date, label: date }));
  const currencyOptions = currencyData.length > 0
    ? Object.keys(currencyData[0]).filter(key => key !== 'Date').map(currency => ({
        value: currency,
        label: currency,
      }))
    : [];

  return (
    <div className="App">
      <h1>Currency Converter</h1>

      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {dates.length > 0 && (
        <div>
          <h3>Select Date:</h3>
          <Calendar
            onChange={(date) => {
              setSelectedDate(date);
              const formattedDate = date.toISOString().split('T')[0]; // Format date to match CSV format
              convertRates(selectedCurrency, formattedDate); // Call convertRates with the formatted date
            }}
            value={selectedDate}
            tileDisabled={({ date }) => !dates.includes(date.toISOString().split('T')[0])} // Disable dates not in CSV
          />
        </div>
      )}

      {currencyData.length > 0 && selectedDate && (
        <Select
          options={currencyOptions}
          onChange={(option) => {
            setSelectedCurrency(option.value);
            const formattedDate = selectedDate.toISOString().split('T')[0];
            convertRates(option.value, formattedDate);
          }}
          placeholder="Select Base Currency"
        />
      )}

      {selectedCurrency && conversionRate && (
        <div className="conversion-rate">
          <h2>
            Conversion Rate for {selectedCurrency} (Base Currency): {conversionRate}
          </h2>
        </div>
      )}

      {convertedRates.length > 0 && (
        <div className="converted-rates">
          <h3>Converted Rates (relative to {selectedCurrency}):</h3>
          
          {/* Sorting Dropdown */}
          <Select
            options={sortOptions}
            onChange={handleSortChange}
            placeholder="Sort By"
          />

          <table>
            <thead>
              <tr>
                <th>Currency</th>
                <th>Converted Rate</th>
              </tr>
            </thead>
            <tbody>
              {convertedRates.map((currency, index) => (
                <tr key={index}>
                  <td>{currency.Currency || "Unknown Currency"}</td>
                  <td>{currency.ConvertedRate === "Invalid" ? "N/A" : currency.ConvertedRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
