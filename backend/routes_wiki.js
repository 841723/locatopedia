const express = require("express");
const {
    checkExistingHash,
    getDataFromHash,
    getDataFromHashAndVersion,
    createNewVersionFromHash,
    createNewArticleFromHash,
    getAll,
    getAllVersionsFromHash,
    getLikesFromHashandEmail,
    toggleLike,

    getPopular,
    getRandom,
    getLiked,
    getCreated,
    getEdited,
    getNewestVersions,
    getNewestArticles,

    deleteArticle,
} = require("./locatopedia");

const { saveBase64asWebP } = require("./utils");

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
        ? await getDataFromHashAndVersion(hash, version, email)
        : await getDataFromHash(hash, email);

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
    }

    res.status(statusCode).send(sendData);
});

// PARAMS: hash, email
// RETURNS: no content
router_wiki.post("/like", async (req, res) => {
    const { hash, email } = req.body;

    const existingHash = await checkExistingHash(hash);
    if (!existingHash) {
        res.status(404).send("Hash not found");
        return;
    }

    const response = await toggleLike(hash, email);

    res.status(204).send();
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
    const { limit=8 } = req.query;
    const popular = await getPopular(limit);
    res.status(200).send(popular);
});

// PARAMS: limit
// RETURNS: [limit] popular articles
router_wiki.get("/random", async (req, res) => {
    const { limit=8 } = req.query;
    const random = await getRandom(limit);
    res.status(200).send(random);
});

// PARAMS: limit, email
// RETURNS: [limit] liked articles
router_wiki.get("/liked", async (req, res) => {
    const { limit=8,email } = req.query;
    const liked = await getLiked(limit, email);
    res.status(200).send(liked);
});

// PARAMS: limit, email
// RETURNS: [limit] articles created by email
router_wiki.get("/created", async (req, res) => {
    const { limit=8, email } = req.query;
    const created = await getCreated(limit, email);
    res.status(200).send(created);
});

// PARAMS: limit, email
// RETURNS: [limit] articles edited by email
router_wiki.get("/edited", async (req, res) => {
    const { limit = 8, email } = req.query;
    const edited = await getEdited(limit, email);
    res.status(200).send(edited);
});

// PARAMS: limit
// RETURNS: [limit] newest versions 
router_wiki.get("/newest/versions", async (req, res) => {
    const { limit = 8, email } = req.query;
    const newest = await getNewestVersions(limit, email);
    res.status(200).send(newest);
});

// PARAMS: limit
// RETURNS: [limit] newest articles
router_wiki.get("/newest/articles", async (req, res) => {
    const { limit = 8 } = req.query;
    const newest = await getNewestArticles(limit);
    res.status(200).send(newest);
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

    const response2 = saveBase64asWebP(
        imgData,
        `public/images/${hashed_b64}.webp`
    );
    if (!response2) {
        res.status(500).send("Internal server error");
        return;
    }

    const data = await createNewArticleFromHash(hashed_b64, {
        auid: auid_comp_b64,
        title,
        subtitle,
        content,
        img_url: `/api/images/${hashed_b64}.webp`,
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

// PARAMS: hash
// RETURNS: true if deleted
router_wiki.delete("/delete", async (req, res) => {
    const { hash } = req.body;

    const response = await deleteArticle(hash);
    console.log("response", response);

    res.status(204).send();
}); 
