import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import errorHandler from "./middleware/errorHandler.js";
import userRoutes from "./routes/user.js";
import emailRoutes from "./routes/emails.js";

const app = express();

app.use(express.json());

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());

const mongoUrl = "mongodb://127.0.0.1:27017/session";
const store = MongoStore.create({ mongoUrl });

app.use(
  session({
    secret: "your_secret_key",
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
  .connect("mongodb://127.0.0.1:27017/email")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
