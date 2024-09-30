import express from 'express';
import dotenv from 'dotenv'
import { connectDB } from './src/db/connectDB.js';
import authRoutes from './src/routes/auth.route.js';
import foodRoutes from './src/routes/food.route.js';
import cartRoutes from './src/routes/cart.route.js';
import restaurantRoutes from './src/routes/restaurant.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { ApiError } from './src/helpers/ApiError.js'


dotenv.config();
const app = express();

app.use(cors())
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.use("/api/auth", authRoutes)
app.use("/api/food", foodRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/restaurant", restaurantRoutes)

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404))
})
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    stack: err.stack
  });
});

app.listen(PORT, () => {
  connectDB()
  console.log('Server is running on port 4000');
})