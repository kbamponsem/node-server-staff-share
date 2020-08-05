const mysql = require("mysql");
require("dotenv").config();
const bcrypt = require("bcrypt");
const fs = require("fs");
const os = require("os");
const { v4: uuidv4 } = require("uuid");
const { resolve } = require("path");

const pool = mysql.createPool({
    database: process.env.MYSQL_DATABASE,
    password: process.env.LOCAL_PASSWORD,
    user: process.env.USER,
    host: process.env.LOCAL_HOST,
    port: "3306",
});

let staffsharedb = {
    sheets: {},
    users: {},
    audios: {},
};

staffsharedb.sheets.all = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM sheet`, (err, results) => {
            if (err) {
                return reject({ error: err.code });
            }
            return resolve(results);
        });
    });
};

staffsharedb.sheets.addSheet = (sheet) => {
    let sheetId = uuidv4();

    // saving file
    let file = sheet.dataPath;
    // remove header
    file = file.split(";base64,").pop();

    let publicDir;
    if (os.platform() === "win32")
        publicDir = __dirname + "\\..\\..\\public\\pdfs\\";
    publicDir = __dirname + "/../../public/pdfs/";
    const filePath = `${publicDir}${sheetId}.pdf`;

    fs.writeFile(filePath, file, { encoding: "base64" }, (err) => {
        console.log("File created");
    });

    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO sheet VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [
                sheetId,
                sheet.title,
                sheet.subtitle,
                sheet.composer,
                sheet.genre,
                sheet.keySignature,
                `${sheetId}.pdf`,
                sheet.createdAt,
                sheet.updateAt,
                sheet.uploadedBy,
            ],
            (err, result) => {
                if (err) return reject({ error: err.code });
                return resolve({ result, sheetId });
            }
        );
    });
};

staffsharedb.audios.addAudio = (audio, sheetId) => {
    return new Promise((resolve, reject) => {
        for (var i = 0; i < audio.length; i++) {
            let audioId = uuidv4();

            let file = audio[i].dataPath;
            file = file.split(";base64,").pop();
            let publicDir;
            if (os.platform() === "win32")
                publicDir = __dirname + "\\..\\..\\public\\audios\\";
            publicDir = __dirname + "/../../public/audios/";
            const filePath = `${publicDir}${audioId}.mp3`;

            fs.writeFile(filePath, file, { encoding: "base64" }, (err) => {
                console.log("Audio file created");
            });

            pool.query(
                `INSERT INTO audio VALUES (?,?,?,?,?)`,
                [
                    audioId,
                    audio[i].partName,
                    `${audioId}.mp3`,
                    audio[i].uploadedBy,
                    sheetId,
                ],
                (err, result) => {
                    if (err) return reject({ error: err.code });
                    return resolve(result);
                }
            );
        }
    });
};

staffsharedb.audios.getAudios = (sheetId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT * FROM audio WHERE sheet_id=?`,
            [sheetId],
            (err, res) => {
                if (err) return reject({ error: err });
                return resolve(res);
            }
        );
    });
};

staffsharedb.audios.updateAudios = (sheetId, audios) => {
    return new Promise((resolve, reject) => {
        let publicDir, filePath, file;
        if (os.platform() === "win32")
            publicDir = __dirname + "\\..\\..\\public\\audios\\";
        publicDir = __dirname + "/../../public/audios/";
        if (audios.length === 0) return resolve({ message: "No audios" });
        for (var i = 0; i < audios.length; i++) {
            filePath = `${publicDir}${audios[i].id}.mp3`;

            file = audios[i].dataPath; // base64 string
            // remove header

            if (audios[i].dataPath.indexOf("data") > -1) {
                file = file.split(";base64,").pop();
                fs.writeFile(filePath, file, { encoding: "base64" }, (err) => {
                    if (err) throw err;
                    console.log("Audio file updated");
                });
            }

            pool.query(
                `
                UPDATE audio SET part_name=?,data_path=?,uploaded_by=? WHERE id=? AND sheet_id=?
            `,
                [
                    audios[i].partName,
                    `${audios[i].id}.mp3`,
                    audios[i].uploadedBy,
                    audios[i].id,
                    sheetId,
                ],
                (err, res) => {
                    if (err) return reject({ error: err });
                    return resolve({ message: "Audio updated successfully" });
                }
            );
        }
    });
};

staffsharedb.audios.removeAudio = (audioIds) => {
    return new Promise((resolve, reject) => {
        for (var i = 0; i < audioIds.length; i++) {
            pool.query(
                `DELETE FROM audio WHERE id=?`,
                audioIds[i],
                (err, res) => {
                    if (err) return reject(err);
                    return resolve(res);
                }
            );
        }
    });
};
staffsharedb.sheets.removeSheet = (sheetId) => {
    return new Promise((resolve, reject) => {
        let publicDir;
        if (os.platform() === "win32")
            publicDir = __dirname + "\\..\\..\\public\\pdfs\\";
        publicDir = __dirname + "/../../public/pdfs/";
        const filePath = `${publicDir}${sheetId}.pdf`;

        // delete file from public folder
        if (fs.existsSync(filePath))
            fs.rmdir(filePath, (err) => {
                console.log(err);
            });

        pool.query(`DELETE FROM sheet WHERE id=?`, sheetId, (err, result) => {
            if (err) return reject({ error: err.code });
            return resolve(result);
        });
    });
};

staffsharedb.sheets.updateSheet = (sheetId, sheet) => {
    let publicDir;
    if (os.platform() === "win32")
        publicDir = __dirname + "\\..\\..\\public\\pdfs\\";
    publicDir = __dirname + "/../../public/pdfs/";
    const filePath = `${publicDir}${sheetId}.pdf`;

    let file = sheet.dataPath; // base64 string
    // remove header
    file = file.split(";base64,").pop();
    fs.writeFile(filePath, file, { encoding: "base64" }, (err) => {
        if (err) throw err;
        console.log("file updated");
    });
    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE sheet SET title=?,subtitle=?,genre=?,keySignature=?, data_path=?, updated_at=?, uploaded_by=? WHERE id=?`,
            [
                sheet.title,
                sheet.subtitle,
                sheet.genre,
                sheet.keySignature,
                `${sheetId}.pdf`,
                sheet.updateAt,
                sheet.uploadedBy,
                sheetId,
            ],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            }
        );
    });
};

staffsharedb.users.register = (user) => {
    return new Promise((resolve, reject) => {
        let userId = uuidv4();
        bcrypt.hash(user.password, 10, (err, hash) => {
            pool.query(
                `INSERT INTO user VALUES (?,?,?,?,?,?)`,
                [
                    userId,
                    user.name,
                    user.email,
                    user.authProvider,
                    hash,
                    user.username,
                ],
                (err, result) => {
                    if (err) {
                        return reject({ error: err.code });
                    }
                    return resolve(result);
                }
            );
        });
    });
};

staffsharedb.users.login = ({ username, password }) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT name,password FROM user WHERE username=? OR email=?`,
            [username, username],
            (err, result) => {
                if (err) {
                    return reject({ error: err.code });
                }
                if (result.length > 0) {
                    if (bcrypt.compareSync(password, result[0].password)) {
                        return resolve({
                            loggedIn: true,
                            name: result[0].name,
                        });
                    }
                }
                return resolve({ loggedIn: false, name: "" });
            }
        );
    });
};
module.exports = staffsharedb;
