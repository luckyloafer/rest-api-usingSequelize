require("dotenv").config({ path: `${process.cwd()}/.env` });

const express = require("express");
const authRouter = require("./route/authRoute");
const projectRouter = require("./route/projectRoute");

const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

const app = express();
app.use(express.json());

// all routes

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't finf ${req.originalUrl}`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server started", PORT);
});
