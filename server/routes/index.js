require("dotenv").config();
const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");
const main = require("./mailer");
const nodemailer = require("nodemailer");
const router = express.Router();
const emailConfirmation = require("./emailStrings");
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "serverstaffshare@gmail.com",
        pass: "serverstaffshare!@#$",
    },
});
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

const fetchLikes = (data) => {
    return Promise.all(
        data.map(async (sheet) => {
            const likes = await db.likes.getSheetLikes(sheet.id);
            return {
                ...sheet,
                likes,
            };
        })
    );
};

const fetchAudios = (data) => {
    return Promise.all(
        data.map(async (sheet) => {
            const audio = await db.audios.getAudios(sheet.id);
            return {
                ...sheet,
                audio,
            };
        })
    );
};
router.get("/sheets", verifyToken, async (req, res, next) => {
    try {
        let newArr;
        let results = await db.sheets.all();

        newArr = await fetchLikes(results);
        newArr = await fetchAudios(newArr);
        res.json(newArr);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/sheet-with-id", async (req, res) => {
    let { sheetId } = req.body;
    try {
        let newArr;
        let results = await db.sheets.getSheetWithId(sheetId);

        newArr = await fetchLikes(results);
        newArr = await fetchAudios(newArr);
        res.json(newArr);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});
router.post("/user-sheets", async (req, res) => {
    let { userName } = req.body;
    try {
        let newArr;
        let results = await db.sheets.userSheets(userName);

        newArr = await fetchLikes(results);
        newArr = await fetchAudios(newArr);
        res.json(newArr);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.post("/search", async (req, res) => {
    try {
        let { key } = req.body;
        const results = await db.sheets.search(key);

        newArr = await fetchLikes(results);
        newArr = await fetchAudios(newArr);

        res.json(newArr);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
router.post("/user-favorites", async (req, res) => {
    try {
        const { userId } = req.body;
        let results = await db.favorites.getUserFavorites(userId);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/user-favorite-sheets", async (req, res) => {
    try {
        const { userId } = req.body;
        let newArr = [];
        let results = await db.sheets.getUserFavoriteSheets(userId);

        newArr = await fetchLikes(results);
        newArr = await fetchAudios(newArr);
        res.json(newArr);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/user-uploads", async (req, res) => {
    try {
        const { userName } = req.body;
        let newArr = [];
        let results = await db.sheets.getUserUploads(userName);

        newArr = await fetchLikes(results);
        newArr = await fetchAudios(newArr);
        res.json(newArr);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
router.post("/user-likes", async (req, res) => {
    try {
        const { userId } = req.body;
        let results = await db.likes.getUserLikes(userId);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
router.post("/like-sheet", async (req, res) => {
    try {
        let { sheetId, userId } = req.body;
        await db.likes.addSheetLikes(sheetId, userId);
        res.json({ message: "Sheet added to likes successfully" });
    } catch (e) {
        console.log(e);
        res.status(500);
    }
});
router.post("/add-fav-sheet", async (req, res) => {
    try {
        let { sheetId, userId } = req.body;
        await db.favorites.addSheetToFav(sheetId, userId);
        res.json({ message: "Sheet added to favorites successfully" });
    } catch (e) {
        console.log(e);
        res.status(500);
    }
});
router.post("/remove-fav-sheet", async (req, res) => {
    try {
        let { sheetId, userId } = req.body;
        await db.favorites.removeSheetFromFav(sheetId, userId);
        res.json({ message: "Sheet removed from favorites successfully" });
    } catch (e) {
        console.log(e);
        res.status(500);
    }
});

router.post("/remove-like-sheet", async (req, res) => {
    try {
        let { sheetId, userId } = req.body;
        await db.likes.removeSheetLikes(sheetId, userId);
        res.json({ message: "Sheet removed from likes successfully" });
    } catch (e) {
        console.log(e);
        res.status(500);
    }
});
router.post("/add-sheet", async (req, res) => {
    try {
        let { sheet, audios } = req.body;
        const { sheetId } = await db.sheets.addSheet(sheet);

        // insert audio files for this sheet
        let result;
        if (audios.length > 0)
            result = await db.audios.addAudio(audios, sheetId);
        res.status(200).send({ message: "Sheet added successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Error occurred" });
    }
});

router.post("/add-audios", async (req, res) => {
    try {
        const { id, audios } = req.body;
        const result = await db.audios.addAudio(audios, id);
        res.status(200).send({ message: "Audios added successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Error occurred" });
    }
});

router.delete("/delete-sheet/:sheetId", async (req, res) => {
    try {
        let sheetId = req.params["sheetId"];
        const results = await db.sheets.removeSheet(sheetId);
        res.status(200).send({ message: "Sheet music deleted successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Error occured" });
    }
});

router.post("/delete-audio", async (req, res) => {
    try {
        let audioIds = req.body;
        console.log("delete-audio", audioIds);
        const result = await db.audios.removeAudio(audioIds);
        res.status(200).send({ message: "Audio deleted successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Error occured" });
    }
});

router.put("/update-sheet/:sheetId", async (req, res) => {
    try {
        let sheetId = req.params["sheetId"];
        let { sheet, audios } = req.body;
        const results = await db.sheets.updateSheet(sheetId, sheet);
        let result = await db.audios.updateAudios(sheetId, audios);
        res.status(200).send({ message: "Sheet music updated successfully" });
    } catch (e) {
        console.log(e);
    }
});

router.get("/confirmation/", async (req, res) => {
    try {
        const { user } = jwt.verify(
            req.query["token"],
            process.env.ACCESS_TOKEN_SECRET
        );

        const result = await db.users.confirmUser(user);
    } catch (e) {
        res.sendStatus(500);
    }

    res.redirect(`${process.env.STAFFSHARE_TESTHOST}/login`);
});

router.post("/send-confirmation", async (req, res) => {
    const { userId, email, username } = req.body;
    console.log(req.body);
    try {
        jwt.sign(
            { user: userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" },
            (err, emailToken) => {
                const url = `${process.env.STAFFSHARE_LOCAL}:${process.env.PORT}/staffshare/api/confirmation/?token=${emailToken}`;
                if (err) console.log(err);
                transporter.sendMail(
                    {
                        from: process.env.SERVER_EMAIL,
                        to: email,
                        subject: "StaffShare - Activate account",
                        html: emailConfirmation(url, username),
                    },
                    (err) => {
                        if (err) console.log(err);
                        else console.log("Mail sent!");
                    }
                );
            }
        );
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
router.post("/register", async (req, res) => {
    let data = req.body;
    try {
        let { userId, email, username } = await db.users.register(data);

        jwt.sign(
            { user: userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" },
            (err, emailToken) => {
                const url = `${process.env.STAFFSHARE_SERVER}/staffshare/api/confirmation/?token=${emailToken}`;
                if (err) console.log(err);
                transporter.sendMail(
                    {
                        from: process.env.SERVER_EMAIL,
                        to: data.email,
                        subject: "StaffShare - Activate account",
                        html: emailConfirmation(url, username),
                    },
                    (err) => {
                        if (err) console.log(err);
                        else console.log("Mail sent!");
                    }
                );
            }
        );

        res.json({
            userId,
            email,
            username,
        });
    } catch (e) {
        res.status(203).send(e);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = req.body;
        const results = await db.users.login(user);

        const { loggedIn, name, userId, username } = results;
        let accessToken;
        if (loggedIn) {
            accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

            res.status(200).send({
                accessToken,
                name,
                userId,
                username,
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
