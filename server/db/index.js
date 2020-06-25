const mysql = require("mysql");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const pool = mysql.createPool({
    connectionLimit: 10,
    password: process.env.PASSWORD,
    user: process.env.USER,
    database: "staff-share",
    host: "localhost",
    port: "3306",
    multipleStatements: true,
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
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO sheet VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [
                sheet.id,
                sheet.title,
                sheet.subtitle,
                sheet.composer,
                sheet.genre,
                sheet.keySignature,
                sheet.dataPath,
                sheet.createdAt,
                sheet.updateAt,
                sheet.uploadedBy,
            ],
            (result, err) => {
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
