const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

require("dotenv").config();
const PORT = process.env.PORT || 4000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

// Importing Routes
const advice = require("./routes/advice");
const user = require("./routes/user");

// Using Routes
app.use("/api/v1", advice);
app.use("/api/v1", user);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const dbConnect = require("./config/database");
const { initializeTrie } = require("./utils/helperFunctions");
dbConnect();

app.get("/", (req, res) => {
  res.send("<h1>Hello heading</h1><p>This is a wonderfull paragraph</p>");
});
