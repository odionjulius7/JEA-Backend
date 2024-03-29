const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
// const fileUpload = require("express-fileupload");

// error handler
const { notFound, handleError } = require("./middleware/error-handler");

// file import
const connectDB = require("./db/connect");
const adminRouter = require("./routes/auth");
const rateLimitter = require("./utils/reqLimit");
const propertyRouter = require("./routes/propertyRoutes");
const blogRouter = require("./routes/blogRoutes");
const projectRouter = require("./routes/projectRoutes");

require("express-async-errors");
const port = process.env.PORT || 4000;
dotenv.config();
const app = express();

// Middleware
app.use(morgan("tiny"));
// app.use(fileUpload());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.get("/", (req, res) => {
  res.status(StatusCodes.OK).send("Hello, World!");
});

/* Starts Using Rate Limiter dynamically, "./utils/reqLimit" */
// app.set("trust proxy", 1);
app.use(
  "/api",
  rateLimitter(60 * 60 * 1000, "Secs", 200, "Only 200 Requests Allowed")
);
app.use("/api/admin", adminRouter);
app.use("/api/property", propertyRouter);
app.use("/api/project", projectRouter);
app.use("/api/blog", blogRouter);

// errors
app.use(notFound);
app.use(handleError);

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
