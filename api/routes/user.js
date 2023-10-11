const express = require("express");
const axios = require("axios")
const router = express.Router();



router.get("/account", async (req, res) => {

    const spotifyResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: process.env.REACT_APP_REDIRECTURI,
        }),
        {
            headers: {
                Authorization: "Basic " + process.env.REACT_APP_BASE64_AUTHORIZATION,
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })

    res.send("test")




})



module.exports = router;
