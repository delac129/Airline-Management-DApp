# Airline Management DApp

## Overview
This decentralized application (DApp) acts as an Airline Management System deployed on the Sepolia test network. The system supports two kinds of users: **CEO** and **Customers**. Customers can view and book flights, while the CEO can create destinations and collect revenue. The application includes a front-end interface integrated with MetaMask for secure interactions.

## Features
### Main Page
- View available flights with details such as seating availability and pricing (in Wei).
- Book flights based on customer preferences (month, class, and round-trip).
- Automatically generates a boarding pass containing flight details upon booking.

### Manager's Page (CEO-Only Access)
- Add new flight destinations with base prices, creating 30 tickets per destination.
- Collect 90% of unclaimed flight revenue directly to the CEO's address.

### Booked Flights Page
- View all flights booked by the logged-in user (Customer or CEO).
- Displays detailed ticket information, including destination, price paid, and the customer's flight preferences.

## Technologies Used
- **Blockchain**: Smart contract deployed on Ethereum's Sepolia test network.
- **Front-End**: React.js with integration to MetaMask.
- **Smart Contracts**: Solidity.

## Gas Consumption
| Function          | Gas Cost (ETH)          | Description                                                    |
|--------------------|-------------------------|----------------------------------------------------------------|
| `deploy()`         | 0.0157371062917329 ETH | Contract deployment and variable initialization.              |
| `createDestination()` | 0.009140109893144004 ETH | Adds new destinations and initializes tickets.                |
| `bookFlight()`     | 0.000569690456955048 ETH | Books flights and assigns boarding passes.                    |
| `payCEO()`         | 0.00008208422864744 ETH | Transfers 90% of revenue to the CEO.                          |

## Steps to Run the Program
1. Clone this repository:
   ```bash
   git clone https://github.com/{your-username}/Airline-Management-DApp.git
   cd airline-management-dapp
   ```
2. Install the dependencies
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the application
  ```bash
  npm run dev
  ```
4. Open the application in a browser
  ```bash
http://localhost:3000/
  ```
