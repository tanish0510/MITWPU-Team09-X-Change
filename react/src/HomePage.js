import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Create a separate CSS file for homepage styles

function HomePage() {
  return (
    <div className="homepage">
      <h1>XChange</h1>
      <div className="button-container">
        <Link to="/currency-chart">
          <button>Currency Chart</button>
        </Link>
        <Link to="/custom-currency-basket">
          <button>Custom Currency Basket</button>
        </Link>
        <Link to="/risk-indicator">
          <button>Risk Indicator</button>
        </Link>
        <Link to="/fx-rates">
          <button>FX Rates for All Currencies</button>
        </Link>
        <Link to="/currency-information">
          <button>Currency Information</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
