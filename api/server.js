// Configure dotenv FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import { connectDB } from "./src/config/connectDB.js";
import { PORT } from "./src/config/env.js";

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => console.log("Server running on port " + PORT));
