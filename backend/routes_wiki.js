const express = require("express");
const {
    checkExistingHash,
    getDataFromHash,
    getDataFromHashAndVersion,
    getPopular,
    createNewVersionFromHash,
    createNewArticleFromHash,
    getAll,
    getAllVersionsFromHash,
} = require("./wikiplace");

const { DGGS_ENDPOINT } = process.env;

const router_wiki = express.Router();
module.exports = router_wiki;

// PARAMS: hash
// RETURNS: data from hash
router_wiki.get("/", async (req, res) => {
    const { hash, version } = req.query;

    console.log("hash", hash);
    console.log("version", version);

    const existingHash = await checkExistingHash(hash);
    let statusCode = 200;
    if (!existingHash) {
        statusCode = 204;
    }

    const data = version ? 
        await getDataFromHashAndVersion(hash, version)
        : 
        await getDataFromHash(hash);
    
        if (!data.auid) {
            res.status(500).send("Internal server error");
            return;
        }
        const response = await fetch(
            `${DGGS_ENDPOINT}/api/dggstools/cuids-from-auid?auid=${data.auid}`
        );
        const { cuids } = await response.json();
        data.cuids = cuids;

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

    const existing = await checkExistingHash(hashed_b64);

    res.status(200).send({ valid: !existing });
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
router_wiki.put("/newversion", async (req, res) => {
    const { hash, title, subtitle, content, email_user, date } = req.body;

    const existingHash = await checkExistingHash(hash);
    if (!existingHash) {
        res.status(404).send("Hash not found");
        return;
    }

    const data = await createNewVersionFromHash(hash, {
        title,
        subtitle,
        content,
        email_user,
        date,
    });

    res.status(200).send(data);
});

// PARAMS: cuids, title, subtitle, content, imgData
// RETURNS: hash, data
router_wiki.post("/add", async (req, res) => {
    const { cuids, title, subtitle, content, imgData, emailUser } = req.body;

    const response = await fetch(
        `${DGGS_ENDPOINT}/api/dggstools/generate-auid-hash?cuids=${cuids}`
    );
    const { auid_comp_b64, hashed_b64 } = await response.json();
    console.log("{ auid_comp_b64, hashed_b64 }", { auid_comp_b64, hashed_b64 });

    const data = await createNewArticleFromHash(hashed_b64, {
        auid: auid_comp_b64,
        title,
        subtitle,
        content,
        img_url: imgData,
        email_user: emailUser,
    });
    data.hash = hashed_b64;

    // { hash, title, subtitle, content, imgData }
    res.status(201).send(data);
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
