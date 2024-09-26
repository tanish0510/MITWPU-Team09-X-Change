import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './HomePage';
import CurrencyChart from './CurrencyChart';
import CustomCurrencyBasket from './CustomCurrencyBasket';
import FXRates from './FXRates';
import './App.css';

const App = () => {
  const [currencyData, setCurrencyData] = useState([]);
  const [dates, setDates] = useState([]);

  return (
    <Router>
      <div className="App">
        <h1>XChange</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/currency-chart">Currency Chart</Link>
          <Link to="/custom-currency-basket">Custom Currency Basket</Link>
          <Link to="/fx-rates">FX Rates for All Currencies</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/currency-chart" element={<CurrencyChart />} />
          <Route path="/custom-currency-basket" element={<CustomCurrencyBasket />} />
          <Route 
            path="/fx-rates" 
            element={
              <FXRates 
                currencyData={currencyData} 
                dates={dates} 
                setCurrencyData={setCurrencyData} 
                setDates={setDates} 
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
