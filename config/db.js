import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const connection = await mysql.createConnection(
	`mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3306/${process.env.DB_NAME}`
);

export default connection;
