import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import errorHandler from "./middleware/errorHandler.js";
import userRoutes from "./routes/user.js";
import emailRoutes from "./routes/emails.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

const app = express();

app.use(express.json());

app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));

app.use(cookieParser());

const mongoUrl = process.env.MONGODB_URL;
const store = MongoStore.create({ mongoUrl });
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use("/user", userRoutes);
app.use("/emails", emailRoutes);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.EXPRESS_PORT, () => {
      console.log(`Server running on port ${process.env.EXPRESS_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
