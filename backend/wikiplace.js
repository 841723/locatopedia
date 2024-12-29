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

async function insertDataFromHash(hash, auid, data) {
    try {
        const res = await pool.query(
            "INSERT INTO article (hash, auid, title, subtitle, content) VALUES ($1, $2, $3, $4, $5)",
            [hash, auid, data.title, data.subtitle, data.content]
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

module.exports = {
    checkValidHash,
    getDataFromHash,
    getPopular,
    setDataFromHash,
    insertDataFromHash,
};
