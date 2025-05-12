import express from "express";
import 'dotenv/config'
import adminRoute from "./routes/adminRoute.js";
import connectDB from "./config/mongoDb.js";
import cors from 'cors'
import facultyRoute from "./routes/facultyRoute.js";
import studentRoute from "./routes/studentRoute.js";
import http from 'http'
import dailyJob from "./dailyJob/dailyJob.js";
import cron from 'node-cron'

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT

app.use(express.json())
const allowedURLs = [process.env.HOD_PAGE_URL ,process.env.FACULTY_PAGE_URL , process.env.FACULTY_PAGE_URL ]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

connectDB()

// api connections
app.use("/api/admin", adminRoute)
app.use("/api/faculty", facultyRoute)
app.use("/api/student", studentRoute)

app.get('/', async (req, res) => {
    res.send(`Sever works Properly`)
})

//Daily Job
cron.schedule("0 22 * * *", async () => {
    console.log("Daily Job running");
    await dailyJob()
})


server.listen(PORT, () => {
    console.log("Sever Running in 3000")
})