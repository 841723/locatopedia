const express = require("express");
const cors = require("cors");
const routes_wiki = require("./routes_wiki");
const routes_wiki_auth = require("./routes_wiki_auth");
const routes_dggs = require("./routes_dggs");


const app = express(); 

app.use(express.json({ limit: "50mb" }));
app.use(cors({
    origin: process.env.CORS_ORIGIN.split(","),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization, Content-Length, X-Requested-With",
}));

const corsOrigin = process.env.CORS_ORIGIN || "*";
console.log("CORS_ORIGIN: ", corsOrigin);

app.use("/api/wiki", routes_wiki);
app.use("/api/wiki/auth", routes_wiki_auth);
app.use("/api/dggstools", routes_dggs);

app.use("/api/images", express.static("public/images"));

const port = 3001;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// catch sigint
process.on("SIGINT", () => {
    console.log("Caught interrupt signal");
    client.end();
    process.exit();
});
