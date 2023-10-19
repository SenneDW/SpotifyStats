
const express = require("express");
const cors = require('cors')
const mongoose = require('mongoose')
const user = require('./routes/user')
const player = require('./routes/player');
const tokens = require("./routes/tokens");
require('dotenv').config()

const PORT = 8080;
const app = express();

app.use(express.json())
app.use(cors());

mongoose.connect(
    process.env.ATLAS_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use("/api/tokens", tokens);
app.use("/api/user", user);
app.use("/api/player", player);


app.get("/api/", (req, res) => {
    res.send("Spotify");
});



app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

module.exports = { db };

