# NexBid

NexBid is a real-time bidding platform built with Node.js and MySQL. This guide will help you clone the repository, set up the MySQL database, install the required packages, create a `.env` file, and run the project.

## Prerequisites

- Node.js installed
- MySQL installed and running
- Git installed

## Getting Started

### Clone the Repository

First, clone the repository to your local machine using Git:

```bash
git clone https://github.com/Tech-Xposer/nexbid.git
cd nexbid
```
### Set up MySQL Database
```
CREATE DATABASE nexbid;
```

### Create the necessary tables.
```
USE nexbid;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT,
  user_id INT,
  bid_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  starting_price DECIMAL(10, 2) NOT NULL,
  current_price DECIMAL(10, 2) DEFAULT 0.00,
  image_url VARCHAR(255),
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  message VARCHAR(255) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

```

### Install Required Packages
Navigate to the project directory and install the necessary packages using npm:
```bash
npm install
```
### Create the .env File
Create a .env file in the root of the project directory and add the following environment variables

```
DB_NAME=nexbid
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword

```
Replace <ins>yourpassword</ins> with your actual MySQL root password

### Run the Project
Start the project using npm:
```Bash
npm start
```
Alternatively, you can start the project using Node.js directly:
```Bash
node index.js
```







 This `README.md` file provides a clear and comprehensive guide to setting up and running the NexBid project. It includes all necessary steps, from cloning the repository and setting up the MySQL database to installing required packages and running the project.
