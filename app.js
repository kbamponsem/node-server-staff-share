const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const bodyParser = require("body-parser");

const app = express();
const postsRoute = require("./routes/posts");

app.use(bodyParser.json());
// ROUTES
app.get("/", (req, res) => {
    res.send("Now at home");
});

app.use("/posts", postsRoute);

//connect to db
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("connected to DB");
    }
);
app.listen(3030);
