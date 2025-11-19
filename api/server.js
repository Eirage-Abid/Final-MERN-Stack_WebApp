import app from "./app.js";
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
    app.listen(process.env.PORT, () =>
      console.log("Server running on " + process.env.PORT)
    );
  })
  .catch(console.error);
