const express = require("express");
const axios = require("axios");
const { setTokens } = require("../module/tokens");
const router = express.Router();

router.post("/getTokens", async (req, res) => {
    const { code } = req.body
    const combinedCredentials = `${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`
    const base64Credentials = btoa(combinedCredentials)
    try {
        const spotifyResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: process.env.REACT_APP_REDIRECTURI,
            }),
            {
                headers: {
                    Authorization: "Basic " + base64Credentials,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })

        setTokens(spotifyResponse.data.access_token, spotifyResponse.data.refresh_token)
        res.status(200).send("Token received successfull")
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;
