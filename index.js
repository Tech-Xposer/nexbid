import app from "./app.js";
import dotenv from "dotenv";
import connection from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
