const express = require("express");
const { checkValidId, getDataFromId, getPopular } = require("./wikiplace");

const router = express.Router();
module.exports = router;

router.post("/test", (req, res) => {
    res.status(200).send("Server is up and running");
});

router.get("/api/wiki", (req, res) => {
    const { id } = req.query;

    if (!checkValidId(id)) {
        res.status(404).send("Invalid id");
        return;
    }

    const data = getDataFromId(id);
    res.status(200).send(data);
});

router.get("/api/wiki/popular", (req, res) => {
    const { limit=2 } = req.query;
    const popular = getPopular(limit);
    res.status(200).send(popular);
});