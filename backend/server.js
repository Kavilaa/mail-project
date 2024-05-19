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

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "your_default_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
};
app.use(session(sessionOptions));

app.use("/user", userRoutes);
app.use("/emails", emailRoutes);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URL, {})
  .then(() => {
    console.log("Connected to MongoDB");
    const port = process.env.EXPRESS_PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
