const express = require("express");
const {
    checkValidHash,
    getDataFromHash,
    getPopular,
    setDataFromHash,
    insertDataFromHash,
    getAll,
    setDataFromHashWithImgData,
    validNewHash,
} = require("./wikiplace");

const { DGGS_ENDPOINT } = process.env;

const router_wiki = express.Router();
module.exports = router_wiki;

// PARAMS: hash
// RETURNS: data from hash
router_wiki.get("/", async (req, res) => {
    const { hash } = req.query;

    const validHash = await checkValidHash(hash);
    let statusCode = 200;
    if (!validHash) {
        statusCode = 204;
    }
    console.log("validHash", validHash);

    const data = await getDataFromHash(hash);

    if (!data.auid) {
        res.status(500).send("Internal server error");
        return;
    }
    const response = await fetch(
        `${DGGS_ENDPOINT}/api/dggstools/cuids-from-auid?auid=${data.auid}`
    );
    const cuids = await response.json();
    data.cuids = cuids.cuids;

    res.status(statusCode).send(data);
});

// PARAMS: none
// RETURNS: all articles
router_wiki.get("/all", async (req, res) => {
    const all = await getAll();
    res.status(200).send(all);
});

router_wiki.get("/validnewcuids", async (req, res) => {
    const { cuids } = req.query;
    const response = await fetch(
        `${DGGS_ENDPOINT}/api/dggstools/generate-auid-hash?cuids=${cuids}`
    );
    const { hashed_b64 } = await response.json();


    const valid = await validNewHash(hashed_b64);
    console.log("valid", valid);

    res.status(200).send({valid});
});


// PARAMS: limit
// RETURNS: [limit] popular articles
router_wiki.get("/popular", async (req, res) => {
    const { limit } = req.query;
    const popular = await getPopular(limit);
    res.status(200).send(popular);
});

// PARAMS: hash, title, subtitle, content
// RETURNS: updated data
router_wiki.put("/update", async (req, res) => {
    const { hash, title, subtitle, content } = req.body;

    const validHash = await getDataFromHash(hash);
    if (!validHash) {
        res.status(404).send("Invalid hash");
        return;
    }

    await setDataFromHash(hash, { title, subtitle, content });

    res.status(200).send({ hash, title, subtitle, content });
});

// PARAMS: hash, title, subtitle, content, imgData
// RETURNS: updated data
router_wiki.put("/update/imgData", async (req, res) => {
    const { hash, title, subtitle, content, imgData } = req.body;

    const validHash = await getDataFromHash(hash);
    if (!validHash) {
        res.status(404).send("Invalid hash");
        return;
    }

    await setDataFromHashWithImgData(hash, { title, subtitle, content, imgData });

    res.status(200).send({ hash, title, subtitle, content, imgData });
});

// PARAMS: cuids, title, subtitle, content, imgData
// RETURNS: hash, data
router_wiki.post("/add", async (req, res) => {
    const { cuids, title, subtitle, content, imgData } = req.body;

    const response = await fetch(
        `${DGGS_ENDPOINT}/api/dggstools/generate-auid-hash?cuids=${cuids}`
    );
    console.log("response", response);
    const { auid_comp_b64, hashed_b64 } = await response.json();
    console.log("{ auid_comp_b64, hashed_b64 }", { auid_comp_b64, hashed_b64 });

    await insertDataFromHash(hashed_b64,auid_comp_b64, {
        title,
        subtitle,
        content,
        imgData,
    });

    res.status(201).send({ hashed_b64, title, subtitle, content, imgData });
});
