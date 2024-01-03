# ball.com Microservices Project
## Overview

ball.com is a microservices-based web store project designed to handle various aspects of a web store, including customer management, inventory management, invoice management, and sales management.

## Microservices

- CustomerManagement
      Manages customer-related functionalities, ensuring seamless customer experiences.

- InventoryManagement
      Handles inventory-related operations to keep track of available products.

- InvoiceManagement
      Manages the creation and processing of invoices for successful transactions.

- SalesManagement
      Focuses on sales-related functionalities, tracking and optimizing sales processes.

## Technologies Used

Programming Language: Typescript, C#
Message Broker: RabbitMQ
Databases:
    - SQL (MariaDB) for relational data storage
    - MongoDB for NoSQL data storage
    - EventstoreDB for event sourcing

## Getting Started

1. Clone the repository:

`git clone https://github.com/TeaDrinkingProgrammer/ball.com.git`

2. Build the containers:
`docker-compose build`

2. Run the microservices:
`docker-compose up`

## Endpoints
### Customer:
`POST` `localhost:3002/api/Customer`

Body:
```json
{
   "name": "Dave",
   "email": "Dave@live.com",
   "phone": "0612345678",
   "address": "Avansstraat 1",
   "dateOfBirth": "01-01-2000",
   "gender": "Male"
}
```
`DELETE` `localhost:3002/api/Customer/{id}`

`GET` `localhost:3002/api/Customer`

`GET` `localhost:3002/api/Customer/{id}`

### Product:
`POST` `localhost:3001/product`

Body:
```json
{
  "quantity": 10,
  "supplier": "ABC Company",
  "name": "Title of new video game",
  "description": "This is a sample product",
  "price": 40,
  "category": "Electronics",
  "manufacturer": "XYZ Corporation"
}
```

`GET` `localhost:3001/product/events`

`PATCH` `localhost:3001/product/stock`

Body:
```json
{
    "id": "c0cfd16c-17a7-4f44-84c5-2b17a72748db",
    "quantity": 400000
}
```

`PATCH` `localhost:3001/product/info`

Body:
```json
{
  "id": "c0cfd16c-17a7-4f44-84c5-2b17a72748db",
  "name": "Product XYZ",
  "description": "This is a sample product",
  "price": 29.99,
  "category": "Electronics",
  "manufacturer": "XYZ Corporation"
}
```

### Order:

`POST` `http://localhost:3000/order`

Body:
```json
{
  "customerId": "1",
  "totalAmount": 100.5,
  "paymentMethod": "credit card",
  "shippingAddress": "123 Main Street, City",
  "products": [
   { "productId": "c0cfd16c-17a7-4f44-84c5-2b17a72748db", "quantity": 20 }
  ]
}
```

`PUT` `localhost:3000/order/`

Body:
```json
{
  "customerId": "1",
  "totalAmount": 102,
  "paymentMethod": "Paypal",
  "shippingAddress": "124 Main Street, City",
  "products": [
   { "productId": "c0cfd16c-17a7-4f44-84c5-2b17a72748db", "quantity": 10 }
  ]
}
```

`GET` `localhost:3000/order`

`GET` `localhost:3000/order/{id}`

### Invoice:

`GET` `localhost:3003/invoice`

`GET` `localhost:3003/invoice/{id}`

`PUT` `localhost:3003/invoice/{id}`

Body:
```json
{
    "paymentStatus": "paid"
}
```
