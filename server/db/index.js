const mysql = require("mysql");
require("dotenv").config();
const bcrypt = require("bcrypt");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const pool = mysql.createPool({
    database: process.env.MYSQL_DATABASE,
    password: process.env.LOCAL_PASSWORD,
    user: process.env.USER,
    host: process.env.MYSQL_HOST,
    port: "3306",
});

let staffsharedb = {
    sheets: {},
    users: {},
};

staffsharedb.sheets.all = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM sheet`, (err, results) => {
            if (err) {
                return reject(err);
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
    const publicDir = __dirname + "\\..\\..\\public\\";
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
                filePath,
                sheet.createdAt,
                sheet.updateAt,
                sheet.uploadedBy,
            ],
            (err, result) => {
                console.log("query result", result);
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
                        return reject(err);
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
                    return reject(err);
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
