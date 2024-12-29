const express = require("express");
const cors = require("cors");
const routes_wiki = require("./routes_wiki");
const routes_dggs = require("./routes_dggs");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/wiki", routes_wiki);
app.use("/api/dggstools", routes_dggs);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// catch sigint
process.on("SIGINT", () => {
    console.log("Caught interrupt signal");
    client.end();
    process.exit();
});
