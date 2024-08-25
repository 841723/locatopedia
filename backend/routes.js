const express = require("express");
const {
    checkValidHash,
    getDataFromHash,
    getPopular,
    setDataFromHash,
} = require("./wikiplace");

const router = express.Router();
module.exports = router;

router.post("/test", (req, res) => {
    res.status(200).send("Server is up and running");
});

router.get("/api/wiki", async (req, res) => {
    const { hash } = req.query;

    if (!checkValidHash(hash)) {
        res.status(404).send("Invalid hash");
        return;
    }

    const data = getDataFromHash(hash);

    if (!data.auid) {
        res.status(500).send("Internal server error");
        return;
    }
    const response = await fetch(
        `http://127.0.0.1:5000/api/dggstools/cuids-from-auid?auid=${data.auid}`
    );
    const cuids = await response.json();
    data.cuids = cuids.cuids;

    res.status(200).send(data);
});

router.get("/api/wiki/popular", (req, res) => {
    const { limit = 2 } = req.query;
    const popular = getPopular(limit);
    res.status(200).send(popular);
});

router.put("/api/wiki/update", (req, res) => {
    const { hash, title, subtitle, content } = req.body;

    if (!checkValidHash(hash)) {
        res.status(404).send("Invalid hash");
        return;
    }

    setDataFromHash(hash, { title, subtitle, content });

    res.status(200).send({ hash, title, subtitle, content });
});







router.get("/api/dggstools/generate-auid-hash", async (req, res) => {
    const { cuids } = req.query;

    if (!cuids) {
        res.status(400).send("Invalid cuids");
        return;
    }

    const response = await fetch(
        `http://127.0.0.1:5000/api/dggstools/generate-auid-hash?cuids=${cuids}`
    );

    const auid_hash = await response.json();
    res.status(200).send(auid_hash);
});

router.get("/api/dggstools/cuids-from-auid", async (req, res) => {
    const { auid } = req.query;

    if (!auid) {
        res.status(400).send("Invalid auid");
        return;
    }

    const response = await fetch(
        `http://127.0.0.1:5000/api/dggstools/cuids-from-auid?auid=${auid}`
    );

    const cuids = await response.json();
    res.status(200).send(cuids);
});

router.get("/api/dggstools/hash", async (req, res) => {
    const { auid } = req.query;

    if (!auid) {
        res.status(400).send("Invalid auid");
        return;
    }

    const response = await fetch(
        `http://127.0.0.1:5000/api/dggstools/hash?auid=${auid}`
    );

    const hash = await response.json();
    res.status(200).send(hash);
});
