import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/routes.js";
import cookieParser from "cookie-parser";
//configuring express app
const app = express();

// setting up cors
app.use(
	cors({
		origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
		credentials: true,
	})
);

// using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(cookieParser(process.env.COOKIE_SECRET))

// routes
app.get("/", (req, res) => {
	res.status(200).json({
		statusCode: 200,
		message: "Welcome to NexBid!",
	});
});

app.use('/api/v1',router)


export default app;
