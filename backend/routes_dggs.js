const express = require("express");

const { DGGS_ENDPOINT } = process.env;

const router_dggs = express.Router();
module.exports = router_dggs;

// PARAMS: cuids
// RETURNS: auid and hash
router_dggs.get("/generate-auid-hash", async (req, res) => {
    const { cuids } = req.query;

    if (!cuids) {
        res.status(400).send("Invalid cuids");
        return;
    }

    const response = await fetch(
        `${DGGS_ENDPOINT}/api/dggstools/generate-auid-hash?cuids=${cuids}`
    );

    const auid_hash = await response.json();
    res.status(200).send(auid_hash);
});

// PARAMS: auid
// RETURNS: cuids
router_dggs.get("/cuids-from-auid", async (req, res) => {
    const { auid } = req.query;

    if (!auid) {
        res.status(400).send("Invalid auid");
        return;
    }

    const response = await fetch(
        `${DGGS_ENDPOINT}/api/dggstools/cuids-from-auid?auid=${auid}`
    );

    const cuids = await response.json();
    res.status(200).send(cuids);
});

// PARAMS: auid
// RETURNS: hash
router_dggs.get("/hash", async (req, res) => {
    const { auid } = req.query;

    if (!auid) {
        res.status(400).send("Invalid auid");
        return;
    }

    const response = await fetch(
        `${DGGS_ENDPOINT}/api/dggstools/hash?auid=${auid}`
    );

    const hash = await response.json();
    res.status(200).send(hash);
});
