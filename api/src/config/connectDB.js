import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";

// Attach helpful connection event listeners for detailed runtime logging
mongoose.connection.on("connected", () => {
  const c = mongoose.connection;
  console.log(
    `Mongoose connected to ${c.host || 'unknown-host'}:${c.port || 'unknown-port'}/${c.name || 'unknown-db'}`
  );
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err && err.message ? err.message : err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose disconnected");
});

export const connectDB = async () => {
  try {
    // Log whether MONGO_URI is set (mask credentials if present)
    if (MONGO_URI) {
      try {
        const safe = MONGO_URI.replace(/:\/\/.*@/, '://****@');
        console.log('Connecting to MongoDB using MONGO_URI:', safe);
      } catch (e) {
        console.log('Connecting to MongoDB (MONGO_URI set)');
      }
    } else {
      console.warn('MONGO_URI is not set');
    }

    await mongoose.connect(MONGO_URI);
    console.log("DB connected");
  } catch (error) {
    // Provide more detailed error output for debugging
    console.error("Database connection error:", error && error.message ? error.message : error);
    if (error && error.stack) console.error(error.stack);
    process.exit(1);
  }
};

