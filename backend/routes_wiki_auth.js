const express = require("express");
const { verifyGoogleToken } = require("./googleOAuth");

const {
    checkExistingHash,
    createNewVersionFromHash,
    createNewArticleFromHash,
    toggleLike,

    getLiked,
    getCreated,
    getEdited,

    deleteArticle,
    canDeleteArticle,
} = require("./locatopedia");

const { saveBase64asWebP } = require("./utils");

const { DGGS_ENDPOINT } = process.env;

const router_wiki_auth = express.Router();
module.exports = router_wiki_auth;

router_wiki_auth.use(async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        console.log("Unauthorized");
        console.log("token", authorization);
        res.status(401).send("Unauthorized");
        return;
    }

    const token = authorization.split(" ")[1];

    const payload = await verifyGoogleToken(token);
    if (!payload) {
        console.log("Unauthorized");
        console.log("token", token);
        res.status(401).send("Unauthorized");
        return;
    }

    // send payload to next middleware
    req.payload = payload;
    next();
});

// PARAMS: hash, email
// RETURNS: no content
router_wiki_auth.post("/like", async (req, res) => {
    const { hash, email } = req.body;

    console.log("like performed", hash, email);


    const existingHash = await checkExistingHash(hash);
    if (!existingHash) {
        res.status(404).send("Hash not found");
        return;
    }

    await toggleLike(hash, email);

    res.status(204).send();
});

// PARAMS: limit, email
// RETURNS: [limit] liked articles
router_wiki_auth.get("/liked", async (req, res) => {
    const { limit = 9 } = req.query;

    const payload = await req.payload;
    const email = payload.email;

    const liked = await getLiked(limit, email);
    res.status(200).send(liked);
});

// PARAMS: limit, email
// RETURNS: [limit] articles created by email
router_wiki_auth.get("/created", async (req, res) => {
    const { limit = 9 } = req.query;

    const payload = await req.payload;
    const email = payload.email;

    const created = await getCreated(limit, email);
    res.status(200).send(created);
});

// PARAMS: limit, email
// RETURNS: [limit] articles edited by email
router_wiki_auth.get("/edited", async (req, res) => {
    const { limit = 9 } = req.query;

    const payload = await req.payload;
    const email = payload.email;

    const edited = await getEdited(limit, email);
    res.status(200).send(edited);
});

// PARAMS: hash, title, subtitle, content
// RETURNS: updated data
router_wiki_auth.put("/newversion", async (req, res) => {
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
router_wiki_auth.post("/add", async (req, res) => {
    const { cuids, title, subtitle, content, imgData, emailUser } = req.body;

    console.log("add received");
    const response = await fetch(
        `${DGGS_ENDPOINT}/api/dggstools/generate-auid-hash?cuids=${cuids}`
    );

    let { auid_comp_b64, hashed_b64 } = await response.json();

    const tests = true; // only for testing purposes
    if (tests) {
        function makeid(length) {
            var result = "";
            var characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(
                    Math.floor(Math.random() * charactersLength)
                );
            }
            return result;
        }

        // set random unique values
        auid_comp_b64 = "diego" + makeid(10);
        hashed_b64 = makeid(25);
    }

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
// RETURNS: true if deleted
router_wiki_auth.delete("/delete", async (req, res) => {
    const { hash } = req.body;

    const payload = await req.payload;
    const email = payload.email;

    if (!(await canDeleteArticle(hash, email))) {
        res.status(401).send("Unauthorized");
        return;
    }

    const response = await deleteArticle(hash);
    console.log("response", response);

    res.status(204).send();
});
