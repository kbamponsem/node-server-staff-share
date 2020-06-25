const express = require("express");
const apiRouter = require("./routes");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/staffshare/api/", apiRouter);

app.listen(process.env.PORT || "3000", "0.0.0.0");
