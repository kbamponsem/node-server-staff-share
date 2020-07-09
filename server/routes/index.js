require("dotenv").config();
const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");
const router = express.Router();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
router.get("/sheets", verifyToken, async (req, res, next) => {
    try {
        let results = await db.sheets.all();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/add-sheet", async (req, res) => {
    try {
        let data = req.body;
        const results = await db.sheets.addSheet(data);
        res.status(200).send({ message: "Sheet added successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Error occured" });
    }
});

router.delete("/delete-sheet/:sheetId", async (req, res) => {
    try {
        let sheetId = req.params["sheetId"];
        console.log(sheetId);
        const results = await db.sheets.removeSheet(sheetId);
        res.status(200).send({ message: "Sheet music deleted successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Error occured" });
    }
});

router.put("/update-sheet/:sheetId", async (req, res) => {
    try {
        let sheetId = req.params["sheetId"];
        let sheet = req.body;
        const results = await db.sheets.updateSheet(sheetId, sheet);
        res.status(200).send({ message: "Sheet music updated successfully" });
    } catch (e) {
        console.log(e);
    }
});

router.post("/register", async (req, res) => {
    let data = req.body;
    try {
        let results = await db.users.register(data);
        res.status(200).send({
            message: "User created successfully",
        });
    } catch (e) {
        res.status(203).send(e);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = req.body;
        const results = await db.users.login(user);

        const { loggedIn, name } = results;
        let accessToken;
        if (loggedIn) {
            accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

            res.status(200).send({
                accessToken,
                name,
            });
        } else {
            res.status(201).send({ message: "User not found" });
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
module.exports = router;
