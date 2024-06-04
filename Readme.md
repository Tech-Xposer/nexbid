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

## Dependencies

- [bcrypt](https://ghub.io/bcrypt): A bcrypt library for NodeJS.
- [chai](https://ghub.io/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [chai-http](https://ghub.io/chai-http): Extend Chai Assertion library with tests for http apis
- [cookie-parser](https://ghub.io/cookie-parser): Parse HTTP request cookies
- [cors](https://ghub.io/cors): Node.js CORS middleware
- [dotenv](https://ghub.io/dotenv): Loads environment variables from .env fileaa
- [express](https://ghub.io/express): Fast, unopinionated, minimalist web framework
- [jsonwebtoken](https://ghub.io/jsonwebtoken): JSON Web Token implementation (symmetric and asymmetric)
- [mocha](https://ghub.io/mocha): simple, flexible, fun test framework
- [mongoose](https://ghub.io/mongoose): Mongoose MongoDB ODM
- [morgan](https://ghub.io/morgan): HTTP request logger middleware for node.js
- [multer](https://ghub.io/multer): Middleware for handling `multipart/form-data`.
- [mysql2](https://ghub.io/mysql2): fast mysql driver. Implements core protocol, prepared statements, ssl and compression in native JS
- [nodemailer](https://ghub.io/nodemailer): Easy as cake e-mail sending from your Node.js applications
- [validator](https://ghub.io/validator): String validation and sanitization
- [ws](https://ghub.io/ws): Simple to use, blazing fast and thoroughly tested websocket client and server for Node.js

## Dev Dependencies

- [nodemon](https://ghub.io/nodemon): Simple monitor script for use during development of a Node.js app.

### Set up MySQL Database

```
CREATE DATABASE nexbid;
```

### Create the necessary tables.

```

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Database: `nexbid`
CREATE DATABASE IF NOT EXISTS `nexbid`;
USE `nexbid`;


CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `starting_price` decimal(10,2) NOT NULL,
  `current_price` decimal(10,2) DEFAULT 0.00,
  `image_url` varchar(255) DEFAULT NULL,
  `end_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `bids` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `bid_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bids_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  CONSTRAINT `bids_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

```

Replace yourpassword with your actual MySQL root password

### Run the Project

Start the project using npm:

```Bash
npm start
```

Alternatively, you can start the project using Node.js directly:

```Bash
node index.js
```

## Register a new user

**POST http://localhost:8001/api/v1/users/register**

> The `POST` request is used to register a new user at the specified endpoint `http://localhost:8001/users/register`. The request requires the following parameters in the raw request body:
>
> - `username` (string): The username of the new user.
> - `password` (string): The password for the new user.
> - `email` (string): The email address of the new user.
>
> The response to the request has a status code of 201 and a content type of `application/json`. The response body follows the JSON schema below:
>
> ```json
> {
> 	"type": "object",
> 	"properties": {
> 		"status": {
> 			"type": "string"
> 		},
> 		"message": {
> 			"type": "string"
> 		},
> 		"data": {
> 			"type": "object",
> 			"properties": {
> 				"id": {
> 					"type": "integer"
> 				},
> 				"username": {
> 					"type": "string"
> 				},
> 				"email": {
> 					"type": "string"
> 				}
> 			}
> 		}
> 	}
> }
> ```

### Body

```json
{
	"username": "username",
	"password": "password",
	"email": "youremail"
}
```

## Login User

**POST http://localhost:8001/api/v1/users/login**

> ### POST /api/v1/users/login
>
> This endpoint is used to authenticate users and obtain a token for accessing protected resources.
>
> #### Request Body
>
> - `username` (string, required): The username of the user.
> - `password` (string, required): The password of the user.
>
> #### Response
>
> The response is in JSON format with the following schema:
>
> ```json
> {
> 	"type": "object",
> 	"properties": {
> 		"status": {
> 			"type": "string"
> 		},
> 		"message": {
> 			"type": "string"
> 		},
> 		"data": {
> 			"type": "object",
> 			"properties": {
> 				"token": {
> 					"type": "string"
> 				}
> 			}
> 		}
> 	}
> }
> ```
>
> The response contains the following fields:
>
> - `status` (string): The status of the response.
> - `message` (string): A message related to the response.
> - `data` (object): An object containing the user's token.

### Body

```json
{
	"username": "dev.ash73",
	"password": "Dev.ash@0703"
}
```

## Authentication

Below APIs uses Bearer Token authentication. To access the endpoints, you need to provide a Bearer token in the Authorization header of your requests.

```http
Authorization: Bearer <your-token-here>
```

## Get User Profile

**GET http://localhost:8001/api/v1/users/profile**

> The `GET` request retrieves the profile of a user from the API.
>
> The response of the request can be documented as a JSON schema:
>
> ```json
> {
> 	"type": "object",
> 	"properties": {
> 		"status": {
> 			"type": "string"
> 		},
> 		"message": {
> 			"type": "string"
> 		},
> 		"data": {
> 			"type": "object",
> 			"properties": {
> 				"id": {
> 					"type": "integer"
> 				},
> 				"username": {
> 					"type": "string"
> 				},
> 				"email": {
> 					"type": "string"
> 				},
> 				"created_at": {
> 					"type": "string"
> 				},
> 				"is_verified": {
> 					"type": "integer"
> 				}
> 			}
> 		}
> 	}
> }
> ```

## Insert Item

**POST http://localhost:8001/api/v1/items/**

> ### POST /api/v1/items/
>
> This endpoint allows the client to create a new item by providing the necessary details.
>
> #### Request Body
>
> - `name` (text): The name of the item.
> - `description` (text): A brief description of the item.
> - `starting_price` (text): The initial price of the item.
> - `image` (file): The image file of the item.
> - `end_time` (text): The end time for the item listing.
>
> #### Response
>
> The response is in JSON format with the following schema:
>
> ```json
> {
> 	"type": "object",
> 	"properties": {
> 		"status": {
> 			"type": "string"
> 		},
> 		"message": {
> 			"type": "string"
> 		},
> 		"data": {
> 			"type": "object",
> 			"properties": {
> 				"itemId": {
> 					"type": "integer"
> 				}
> 			}
> 		}
> 	}
> }
> ```
>
> The response includes:
>
> - `status` (string): The status of the response.
> - `message` (string): A message related to the response.
> - `data` (object): The data object containing the newly created item's ID.
>
> Example Response:
>
> ```json
> {
> 	"status": "sample_status",
> 	"message": "sample_message",
> 	"data": {
> 		"itemId": 123
> 	}
> }
> ```

## Get All Items

**GET http://localhost:8001/api/v1/items**

> The `GET` request retrieves a list of items from the API endpoint `http://localhost:8001/api/v1/items`.
>
> ### Response
>
> The response is a JSON object with the following schema:
>
> ```json
> {
> 	"type": "object",
> 	"properties": {
> 		"status": {
> 			"type": "string"
> 		},
> 		"message": {
> 			"type": "string"
> 		},
> 		"data": {
> 			"type": "object",
> 			"properties": {
> 				"total_items": {
> 					"type": "integer"
> 				},
> 				"items": {
> 					"type": "array",
> 					"items": {
> 						"type": "object",
> 						"properties": {
> 							"id": {
> 								"type": "integer"
> 							},
> 							"name": {
> 								"type": "string"
> 							},
> 							"description": {
> 								"type": "string"
> 							},
> 							"starting_price": {
> 								"type": "string"
> 							},
> 							"current_price": {
> 								"type": "string"
> 							},
> 							"image_url": {
> 								"type": ["string", "null"]
> 							},
> 							"end_time": {
> 								"type": "string"
> 							},
> 							"created_at": {
> 								"type": "string"
> 							},
> 							"created_by": {
> 								"type": "integer"
> 							}
> 						},
> 						"required": [
> 							"id",
> 							"name",
> 							"description",
> 							"starting_price",
> 							"current_price",
> 							"end_time",
> 							"created_at",
> 							"created_by"
> 						]
> 					}
> 				}
> 			},
> 			"required": ["total_items", "items"]
> 		}
> 	},
> 	"required": ["status", "message", "data"]
> }
> ```

## Get Items By Id

**GET http://localhost:8001/api/v1/items/8**

> ### Get Item Details
>
> This endpoint makes an HTTP GET request to retrieve the details of a specific item.
>
> #### Request
>
> - Method: GET
> - Endpoint: `http://localhost:8001/api/v1/items/8`
>
> #### Response
>
> - Status: 200
> - Content-Type: application/json
> - Body:
>   ```json
>   {
>   	"status": "",
>   	"message": "",
>   	"data": {
>   		"item": {
>   			"id": 0,
>   			"name": "",
>   			"description": "",
>   			"starting_price": "",
>   			"current_price": "",
>   			"image_url": "",
>   			"end_time": "",
>   			"created_at": "",
>   			"created_by": 0
>   		}
>   	}
>   }
>   ```
>   The response contains the details of the item including its ID, name, description, starting price, current price, image URL, end time, creation timestamp, and the ID of the creator.

## Place a Bid

**POST http://localhost:8001/api/v1/items/4/bids**

> The endpoint allows the user to place a bid for a specific item.
>
> ### Request Body
>
> - `bid_amount` (number, required): The amount of the bid.
>
> ### Response
>
> The response will be in the form of a JSON schema.

### Body

```json
{
	"bid_amount": 3000
}
```

## Delete a bid(Admin Only)

**DELETE http://localhost:8001/api/v1/bids/1**

> The API endpoint sends a response with status code 401 and content type "application/json". The response body contains a JSON object with keys "status" and "error". To document the response as a JSON schema, the following structure can be used:
>
> ```json
> {
> 	"type": "object",
> 	"properties": {
> 		"status": {
> 			"type": "string"
> 		},
> 		"error": {
> 			"type": "string"
> 		}
> 	}
> }
> ```

## Get Notifications

**GET http://localhost:8001/api/v1/notifications/**

> # Get Notifications
>
> This endpoint retrieves a list of notifications.
>
> ## Request
>
> ### Query Parameters
>
> - None
>
> ### Response
>
> The response will be a JSON object with the following schema:
>
> ```json
> {
> 	"type": "object",
> 	"properties": {
> 		"status": {
> 			"type": "string"
> 		},
> 		"message": {
> 			"type": "string"
> 		},
> 		"data": {
> 			"type": "object",
> 			"properties": {
> 				"notifications": {
> 					"type": "array",
> 					"items": {}
> 				}
> 			}
> 		}
> 	}
> }
> ```

## Update Item By Id

**PUT http://localhost:8001/api/v1/items/1**

> ### Update Item Details
>
> This endpoint is used to update the details of a specific item.
>
> #### Request
>
> - Method: PUT
> - URL: `http://localhost:8001/api/v1/items/1`
> - Body:
>   - `name` (string, required): The name of the item.
>   - `description` (string, required): The description of the item.
>   - `starting_price` (number, required): The starting price of the item.
>   - `end_time` (string, required): The end time of the item.
>
> #### Response
>
> The response is in JSON format with the following schema:
>
> ```json
> {
> 	"type": "object",
> 	"properties": {
> 		"status": {
> 			"type": "string"
> 		},
> 		"message": {
> 			"type": "string"
> 		},
> 		"data": {
> 			"type": "object",
> 			"properties": {
> 				"fieldCount": {
> 					"type": "number"
> 				},
> 				"affectedRows": {
> 					"type": "number"
> 				},
> 				"insertId": {
> 					"type": "number"
> 				},
> 				"info": {
> 					"type": "string"
> 				},
> 				"serverStatus": {
> 					"type": "number"
> 				},
> 				"warningStatus": {
> 					"type": "number"
> 				},
> 				"changedRows": {
> 					"type": "number"
> 				}
> 			}
> 		}
> 	}
> }
> ```

### Body

```json
{
	"name": "Updated Item",
	"description": "This is an updated item.",
	"starting_price": 100.0,
	"end_time": "2024-06-06"
}
```

This `README.md` file provides a clear and comprehensive guide to setting up and running the NexBid project. It includes all necessary steps, from cloning the repository and setting up the MySQL database to installing required packages and running the project.
