const { Pool } = require("pg");

const { PG_HOST, PG_DATABASE, PG_USER, PG_PASSWORD, PG_PORT } = process.env;

const pool = new Pool({
    host: PG_HOST,
    database: PG_DATABASE,
    user: PG_USER,
    password: PG_PASSWORD,
    port: PG_PORT,
});

async function checkValidHash(hash) {
    try {
        const res = await pool.query("SELECT * FROM article WHERE hash = $1", [
            hash,
        ]);
        console.log(res.rows.length > 0);
        return res.rows.length > 0;
    } catch (err) {
        console.log("Error in checkValidHash");
        console.log(err);
        return false;
    }
}

async function getDataFromHash(hash) {
    const res = await pool.query("SELECT * FROM article WHERE hash = $1", [
        hash,
    ]);
    if (res.rows.length > 0) {
        return res.rows[0];
    } else {
        return null;
    }
}

async function setDataFromHash(hash, data) {
    try {
        console.log("setDataFromHash, hash: ", hash, "data: ", data);
        const res = await pool.query(
            "UPDATE article SET title = $1, subtitle = $2, content = $3 WHERE hash = $4",
            [data.title, data.subtitle, data.content, hash]
        );
        return res;
    } catch (err) {
        console.log("Error in setDataFromHash");
        console.log(err);
        return [];
    }
}

async function setDataFromHashWithImgData(hash, data) {
    try {
        console.log("setDataFromHash, hash: ", hash, "data: ", data);
        const res = await pool.query(
            "UPDATE article SET title = $1, subtitle = $2, content = $3, img = $4 WHERE hash = $5",
            [data.title, data.subtitle, data.content, data.imgData, hash]
        );
        return res;
    } catch (err) {
        console.log("Error in setDataFromHashWithImgData");
        console.log(err);
        return [];
    }
}

async function insertDataFromHash(hash, auid, data) {
    try {
        const res = await pool.query(
            "INSERT INTO article (hash, auid, title, subtitle, content, img) VALUES ($1, $2, $3, $4, $5, $6)",
            [hash, auid, data.title, data.subtitle, data.content, data.imgData]
        );
        return res;
    }
    catch (err) {
        console.log("Error in insertDataFromHash");
        console.log(err);
        return [];
    }
}

async function getPopular(num) {
    try {
        const res = await pool.query("SELECT * FROM article ORDER BY RANDOM() LIMIT $1", [num]);
        return res.rows;
    } catch (err) {
        console.log("Error in getPopular");
        console.log(err);
        return [];
    }
}

async function getAll() {
    try {
        const res = await pool.query("SELECT * FROM article ORDER BY RANDOM()");
        return res.rows;
    } catch (err) {
        console.log("Error in getAll");
        console.log(err);
        return [];
    }
}

async function validNewHash(hash) {
    try {
        const res = await pool.query("SELECT * FROM article WHERE hash = $1", [
            hash,
        ]);
        return res.rows.length === 0;
    } catch (err) {
        console.log("Error in validNewHash");
        console.log(err);
        return false;
    }
}

module.exports = {
    checkValidHash,
    getDataFromHash,
    getPopular,
    setDataFromHash,
    setDataFromHashWithImgData,
    insertDataFromHash,
    getAll,
    validNewHash,
};
