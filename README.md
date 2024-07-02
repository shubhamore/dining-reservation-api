# Dining Reservation System API

This project is a dining reservation system API built with Node.js, Express, and Sequelize, using MySQL for the database. The API allows users to browse different dining places, check availability, and make reservations. It includes JWT authentication, clustering for horizontal scaling, rate limiting, compression, and Helmet for additional security.

## Features

- User and Admin roles
- Browse dining places
- Check dining place availability
- Make reservations
- JWT authentication
- Clustering for horizontal scaling
- Rate limiting
- Compression
- Helmet for security

## Prerequisites

- Node.js (v14 or higher)
- MySQL

## Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/shubhamore/workindia.git
cd workindia
```

### Step 2: Create a `.env` file

Create a `.env` file in the root directory of the project with the following variables:

```
MYSQL_HOST=your_mysql_host
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_database_name
PORT=your_preferred_port
DIALECT=mysql
JWT_SECRET=your_jwt_secret
```

### Step 3: Create MySQL Database

Create a MySQL database with the same name as specified in your `.env` file under `MYSQL_DATABASE`.

### Step 4: Install dependencies

```bash
npm install
```

### Step 5: Start the server

To start a single instance of the Node server:

```bash
npm run start
```

To start a cluster of backend instances (for horizontal scaling):

```bash
npm run start-cluster
```

## Security

- **JWT Authentication**: Used for securing API endpoints.
- **Helmet**: Helps secure the app by setting various HTTP headers.
- **Rate Limiting**: Limits the number of requests to the API to prevent abuse.
- **Compression**: Compresses the responses to improve performance.
- **Clustering**: Used for horizontal scaling to handle more requests.

## Endpoints

### User Endpoints

#### Sign Up

- **URL**: `http://localhost:8080/api/signup/`
- **Method**: POST
- **Body**:
  ```json
  {
    "username": "shubham",
    "password": "password",
    "email": "shubham.more@spit.ac.in"
  }
  ```

#### Log In

- **URL**: `http://localhost:8080/api/login/`
- **Method**: POST
- **Body**:
  ```json
  {
    "username": "shubham",
    "password": "password"
  }
  ```

### Admin Endpoints

#### Admin Sign Up

- **URL**: `http://localhost:8080/api/admin/signup`
- **Method**: POST
- **Body**:
  ```json
  {
    "username": "dev",
    "password": "password",
    "email": "dev@gmail.com"
  }
  ```

#### Admin Log In

- **URL**: `http://localhost:8080/api/admin/login`
- **Method**: POST
- **Body**:
  ```json
  {
    "username": "dev",
    "password": "password"
  }
  ```

### Dining Place Endpoints

#### Add a New Dining Place (Admin Only)

- **URL**: `http://localhost:8080/api/dining-place/create`
- **Method**: POST
- **Headers**: `{ "Authorization": "Bearer {token}" }`
- **Body**:
  ```json
  {
    "name": "asdfGatsby",
    "address": "HSR Layout",
    "phone_no": "9999999999",
    "website": "http://workindia.in",
    "operational_hours": {
      "open_time": "00:00:00",
      "close_time": "23:00:00"
    }
  }
  ```

#### Search Dining Places by Name

- **URL**: `http://localhost:8080/api/dining-place`
- **Method**: GET
- **Query Parameters**: `name=Gatsby`

#### Get Dining Place Availability

- **URL**: `http://localhost:8080/api/dining-place/availability`
- **Method**: GET
- **Query Parameters**: `place_id=1&start_time=2023-02-02T14:00:00Z&end_time=2023-02-01T15:00:00Z`

#### Make a Booking

- **URL**: `http://localhost:8080/api/dining-place/book`
- **Method**: POST
- **Headers**: `{ "Authorization": "Bearer {token}" }`
- **Body**:
  ```json
  {
    "place_id": "1",
    "start_time": "2023-01-02T12:00:00Z",
    "end_time": "2023-01-01T13:00:00Z"
  }
  ```

