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

app.use(express.json());
const corsOptions = {
  origin: ['http://localhost:5173', 'https://task-timer-green.vercel.app'],
  credentials: true
};
app.use(cors(corsOptions));


const PORT = process.env.PORT || 4000


const startServer = async () => {
  await connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timelogs', timeLogRoutes);
app.use('/api/summary', summaryRoute)

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();