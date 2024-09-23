const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", routes);

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
