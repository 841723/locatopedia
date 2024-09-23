const { Client } = require("pg");

const client = new Client({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect();


async function checkValidHash(hash) {
    try {
        const res = await client.query(
            "SELECT * FROM article WHERE hash = $1",
            [hash]
        );
        return res.rows.length > 0;
    } catch (err) {
        console.log("Error in checkValidHash");
        console.log(err);
        return false;
    }
}

async function getDataFromHash(hash) {
    const res = await client.query("SELECT * FROM article WHERE hash = $1", [
        hash,
    ]);
    if (res.rows.length > 0) {
        return res.rows[0];
    }
    else {
        throw new Error("No data found for hash: " + hash);
    }
}

async function setDataFromHash(hash, data) {
    try {
        const res = await client.query(
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

async function getPopular(num) {
    try {
        console.log("Getting popular");

        const res = await client.query("SELECT * FROM article LIMIT $1", [num]);
        return [res.rows[0], res.rows[0], res.rows[0]];
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
};
