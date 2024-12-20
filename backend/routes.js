const express = require("express");
const {
    checkValidHash,
    getDataFromHash,
    getPopular,
    setDataFromHash,
} = require("./wikiplace");

const router = express.Router();
module.exports = router;


// test
router.get("/test", (req, res) => {
    res.status(200).send("<h1>Server is up and running</h1>");
});

// PARAMS: hash
// RETURNS: data from hash
router.get("/api/wiki", async (req, res) => {
    const { hash } = req.query;

    if (!checkValidHash(hash)) {
        res.status(404).send("Invalid hash");
        return;
    }

    const data = await getDataFromHash(hash);
    console.log(data);

    if (!data.auid) {
        res.status(500).send("Internal server error");
        return;
    }
    const response = await fetch(
        `http://dggstools:5000/api/dggstools/cuids-from-auid?auid=${data.auid}`
    );
    const cuids = await response.json();
    data.cuids = cuids.cuids;

    res.status(200).send(data);
});


// PARAMS: limit
// RETURNS: [limit] popular articles
router.get("/api/wiki/popular", async (req, res) => {
    const { limit = 2 } = req.query;
    const popular = await getPopular(limit);
    res.status(200).send(popular);
});


// PARAMS: hash, title, subtitle, content
// RETURNS: updated data
router.put("/api/wiki/update", async (req, res) => {
    const { hash, title, subtitle, content } = req.body;

    if (!checkValidHash(hash)) {
        res.status(404).send("Invalid hash");
        return;
    }

    await setDataFromHash(hash, { title, subtitle, content });

    res.status(200).send({ hash, title, subtitle, content });
});


// PARAMS: cuids
// RETURNS: auid and hash
router.get("/api/dggstools/generate-auid-hash", async (req, res) => {
    const { cuids } = req.query;

    if (!cuids) {
        res.status(400).send("Invalid cuids");
        return;
    }

    const response = await fetch(
        `http://dggstools:5000/api/dggstools/generate-auid-hash?cuids=${cuids}`
    );

    const auid_hash = await response.json();
    res.status(200).send(auid_hash);
});


// PARAMS: auid
// RETURNS: cuids
router.get("/api/dggstools/cuids-from-auid", async (req, res) => {
    const { auid } = req.query;

    if (!auid) {
        res.status(400).send("Invalid auid");
        return;
    }

    const response = await fetch(
        `http://dggstools:5000/api/dggstools/cuids-from-auid?auid=${auid}`
    );

    const cuids = await response.json();
    res.status(200).send(cuids);
});


// PARAMS: auid
// RETURNS: hash
router.get("/api/dggstools/hash", async (req, res) => {
    const { auid } = req.query;

    if (!auid) {
        res.status(400).send("Invalid auid");
        return;
    }

    const response = await fetch(
        `http://dggstools:5000/api/dggstools/hash?auid=${auid}`
    );

    const hash = await response.json();
    res.status(200).send(hash);
});
