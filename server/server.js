const express = require("express");
const apiRouter = require("./routes");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use("/public", express.static("public"));
app.use(
    express.json({
        limit: "50mb",
    })
);
app.use(
    express.urlencoded({
        limit: "100mb",
        parameterLimit: 100000,
        extended: true,
    })
);

app.use("/staffshare/api/", apiRouter);

app.listen(process.env.PORT || "3000", () => console.log('server started', 'PORT', process.env.PORT));
