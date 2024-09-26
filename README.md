
# X:Change

The {X:Chnage} project provides users with a powerful and dynamic interface to visualize historical exchange rates. Designed with user experience in mind, this application empowers individuals, businesses, and analysts to make informed decisions by offering insightful visualizations of currency trends.

Users can effortlessly select different currencies from a wide range of options and explore exchange rate trends over various time periods, including daily, weekly, monthly, and custom ranges. This flexibility allows for a comprehensive analysis of market movements and historical performance.


## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `Period` | **Required**. http://localhost:5000/api/exchange-rates/USD/weekly
 |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `Custom` | **Required**. http://localhost:5000/api/exchange-rates/USD/2022-01-01:2022-01-31
 |

#### add(num1, num2)

Takes two numbers and returns the sum.


## Appendix
1. The exchange rate data used in this project is retrieved from:
- [International Monetary Fund](https://www.imf.org/external/np/fin/ert/GUI/Pages/ReportOptions.aspx)
The API endpoints fetch data in JSON format, which is then processed and visualized using Chart.js.

2. Volatility is calculated as the percentage change between consecutive daily exchange rates:
volatility = ((current_rate - previous_rate) / previous_rate) * 100

Risk levels are defined as:
- **Low Risk**: Volatility ≤ 1%
- **Medium Risk**: Volatility > 1% and ≤ 3%
- **High Risk**: Volatility > 3%

3. Further Improvements
- **Currency Conversion**: Add functionality to convert currencies based on exchange rates.
- **Historical Data**: Expand the time range for exchange rates up to 5 years.
- **Prediction**: Implement machine learning models to predict future exchange rates based on historical data.

4. Glossary
- **Volatility**: A statistical measure of the dispersion of returns for a given security or market index.
- **API**: Application Programming Interface, a set of functions that allow applications to access data or features from other services.

## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Low Risk (Stable) | ![#28a745](https://via.placeholder.com/10/28a745?text=+) #28a745   |
| Medium Risk       | ![#ffc107](https://via.placeholder.com/10/ffc107?text=+) #ffc107   |
| High Risk         | ![#dc3545](https://via.placeholder.com/10/dc3545?text=+) #dc3545   |
| Background        | ![#f8f9fa](https://via.placeholder.com/10/f8f9fa?text=+) #f8f9fa   |
| Chart Line        | ![#007bff](https://via.placeholder.com/10/007bff?text=+) #007bff   |
| Text Color        | ![#343a40](https://via.placeholder.com/10/343a40?text=+) #343a40   |

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


## Documentation

[Documentation]([X_Change (3).pdf](https://github.com/tanish0510/MITWPU-Team09-X-Change/blob/main/northern/X_Change%20(3).pdf#:~:text=2%20hours%20ago-,X_Change%20(3).pdf,-now)

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

- `API_KEY`: Your API key for accessing the exchange rates data.
- `DATABASE_URL`: Connection string for your database (if applicable).
- `SECRET_KEY`: A secret key used for session management (if applicable).
## Features

- **Dynamic Exchange Rate Graphs**: Visualize exchange rates over different periods with customizable date ranges.
- **Volatility Indicators**: View color-coded line graphs indicating low, medium, and high volatility levels.
- **Risk Assessment**: Get insights into the risk associated with exchange rates.
- **Custom Currency Selection**: Easily select currencies for comparison in the graph.
- **Responsive Design**: Works seamlessly across different devices and screen sizes.
## Installation

To install and run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/my-project.git

2. Navigate into the project directory:
    cd my-project
    Install the necessary dependencies:

3. Start the development server:
    Open your browser and go to http://localhost:5000 to view the application.

Make sure to replace `https://github.com/yourusername/my-project.git` with the actual URL of your GitHub repository!

<<<<<<< HEAD

=======
## How to run
->clone the repo

-> cmd:01- cd northern/backend

-> cmd:02- npm run

-> cmd:03- node server.js

**Now the backend is running and you can test it through the postman api calls.**

**for frontend** (when backend is in motion)

->Run the **index.html** file on browser and navigate throught the project
>>>>>>> 6ae1dd9fd0c7768bcda3cdf60ff062cc2d6a4ec3




![Logo](449A9D8E-1E8F-4DCE-A1D0-7BF32F1A31BE_4_5005_c.jpeg)


## License


## Run Locally

To run the project locally, follow these steps:

1. Clone the project repository:
   ```bash
   git clone https://github.com/yourusername/my-project.git

2. Navigate to project directory
  cd my-project

3. Install the required dependencies:
  npm install
  Start the server:

4. Open your browser and visit http://localhost:5000 to view the application.
Make sure to replace `https://github.com/yourusername/my-project.git` with the actual URL of your GitHub repository!








## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

## Tech Stack

**Client:** HTML, CSS, JavaScript, Chart.js

**Server:** Node.js, Express.js

**Database:** MongoDB 

**Other:** REST API for fetching exchange rates
## Running Tests

To run tests, ensure you have Jest installed, then execute the following command:

```bash
npm test
