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

// let DB_INFO = {
//     "HYXEGM7k7y5RX13g0uD1_eFnL4I=": {
//         title: "Hexágono de la ciudad de Zaragoza",
//         subtitle: "Este es mi hexágono favorito de mi cuidad natal",
//         content: textContent,
//         auid: "eJyLs7AwtjQ3MDQyTUoDARV7OLBIMTJEFTMzh_ABhoQO3A==",
//         hash: "HYXEGM7k7y5RX13g0uD1_eFnL4I=",
//     },
// };

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

function setDataFromHash(hash, data) {
    DB_INFO[hash].title = data.title;
    DB_INFO[hash].subtitle = data.subtitle;
    DB_INFO[hash].content = data.content;

    console.log(DB_INFO[hash].title, DB_INFO[hash].subtitle);
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
