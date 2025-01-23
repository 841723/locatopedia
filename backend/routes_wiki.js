const express = require("express");

const {
    checkExistingHash,
    getDataFromHash,
    getDataFromHashAndVersion,
    getAll,
    getAllVersionsFromHash,
    getLikesFromHashandEmail,

    getPopular,
    getRandom,
    getNewestVersions,
    getNewestArticles,
} = require("./locatopedia");

const { DGGS_ENDPOINT } = process.env;

const router_wiki = express.Router();
module.exports = router_wiki;

// PARAMS: hash
// RETURNS: data from hash
router_wiki.get("/", async (req, res) => {
    const { hash, version, email } = req.query;

    const existingHash = await checkExistingHash(hash);
    let statusCode = 200;
    if (!existingHash) {
        statusCode = 204;
    }

    const data = version
        ? await getDataFromHashAndVersion(hash, version)
        : await getDataFromHash(hash);

    if (!data.auid) {
        res.status(500).send("Internal server error");
        return;
    }

    const data2 = await getLikesFromHashandEmail(hash, email);

    const response = await fetch(
        `${DGGS_ENDPOINT}/api/dggstools/cuids-from-auid?auid=${data.auid}`
    );
    const { cuids } = await response.json();

    const sendData = {
        ...data,
        ...data2,
        cuids,
    };

    res.status(statusCode).send(sendData);
});

// PARAMS: none
// RETURNS: all articles
router_wiki.get("/all", async (req, res) => {
    const all = await getAll();
    res.status(200).send(all);
});

// PARAMS: cuids
// RETURNS: true if valid
router_wiki.get("/validnewcuids", async (req, res) => {
    const { cuids } = req.query;
    const response = await fetch(
        `${DGGS_ENDPOINT}/api/dggstools/generate-auid-hash?cuids=${cuids}`
    );
    const { hashed_b64 } = await response.json();

    const existing = await checkExistingHash(hashed_b64);

    res.status(200).send({ valid: !existing });
});

// PARAMS: limit
// RETURNS: [limit] popular articles
router_wiki.get("/popular", async (req, res) => {
    const { limit = 9 } = req.query;
    const popular = await getPopular(limit);
    res.status(200).send(popular);
});

// PARAMS: limit
// RETURNS: [limit] popular articles
router_wiki.get("/random", async (req, res) => {
    const { limit = 9 } = req.query;
    const random = await getRandom(limit);
    res.status(200).send(random);
});

// PARAMS: limit
// RETURNS: [limit] newest versions
router_wiki.get("/newest/versions", async (req, res) => {
    const { limit = 9 } = req.query;
    const newest = await getNewestVersions(limit);
    res.status(200).send(newest);
});

// PARAMS: limit
// RETURNS: [limit] newest articles
router_wiki.get("/newest/articles", async (req, res) => {
    const { limit = 9 } = req.query;
    const newest = await getNewestArticles(limit);
    res.status(200).send(newest);
});

// PARAMS: hash
// RETURNS: all versions of hash
router_wiki.get("/:hash/versions", async (req, res) => {
    const { hash } = req.params;

    console.log("hash", hash);
    const existingHash = await checkExistingHash(hash);
    if (!existingHash) {
        res.status(404).send("Hash not found");
        return;
    }

    const data = await getAllVersionsFromHash(hash);
    console.log("data", data);

    res.status(200).send(data);
});
