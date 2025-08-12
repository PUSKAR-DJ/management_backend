const express = require("express")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")
const cookieParser = require("cookie-parser")
const compression = require("compression")
const cors = require("cors")

require("dotenv").config();

// Routes
const AppError = require("./utils/appError")
const globalErrorHandler = require("./controllers/errorController")
const authRouter = require("./routes/authRoutes")
const userRouter = require("./routes/userRoutes")
const teamRouter = require("./routes/teamRoutes")
const projectRouter = require("./routes/projectRoutes");
const dashboardRouter = require("./routes/dashboardRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const reportRouter = require("./routes/reportRoutes");
const salaryRouter = require("./routes/salaryRoutes");
const receivedDataRouter = require("./routes/receivedDataRoutes");
const tlReviewRouter = require('./routes/tlReviewRoutes');
const executiveRouter = require('./routes/executiveRoutes');

const app = express()

app.enable("trust proxy")

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL_2,
  // process.env.FRONTEND_URL_3,
  // process.env.FRONTEND_URL_4
];


app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.options("*", cors())

app.use(helmet())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

const limiter = rateLimit({
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
})
app.use("/api", limiter)

app.use(express.json({ limit: "50kb" }))
app.use(express.urlencoded({ extended: true, limit: "50kb" }))
app.use(cookieParser())

app.use(mongoSanitize())

app.use(xss())

app.use(hpp())

app.use(compression())

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/teams", teamRouter)
app.use("/api/projects", projectRouter)
app.use("/api/dashboard", dashboardRouter)
app.use('/api/reviews', reviewRouter);
app.use("/api/reports", reportRouter);
app.use("/api/salaries", salaryRouter);
app.use("/api/received-data", receivedDataRouter);
app.use('/api/tl/reviews', tlReviewRouter);
app.use('/api/executive', executiveRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app