import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import authRoutes from "./routes/auth.js"
import taskRoutes from "./routes/task.js";
import timeLogRoutes from "./routes/timelog.js";
import summaryRoute from "./routes/summary.js";

dotenv.config();

const app = express();


const allowedOrigins = [
  'http://localhost:5173',
  'https://task-timer-vpfs.vercel.app'
];


app.use(express.json());

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));


const PORT = process.env.PORT || 4000;

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timelogs', timeLogRoutes);
app.use('/api/summary', summaryRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at port ${PORT}`);
});
