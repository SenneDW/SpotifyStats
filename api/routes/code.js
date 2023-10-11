const express = require("express");
const axios = require("axios")
const router = express.Router();

let accessToken = null
let refreshToken = null
let timeStampReceivedAccessToken = null

function isAccessTokenExpired(access_token) {
    console.log(timeStampReceivedAccessToken);
    const currentTimestamp = Math.floor(Date.now() / 1000)
    console.log(currentTimestamp);
    return accessToken
}

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
        console.log(spotifyResponse.data);
        timeStampReceivedAccessToken = Math.floor(Date.now() / 1000)
        accessToken = spotifyResponse.data.access_token
        refreshToken = spotifyResponse.data.refresh_token
        res.status(200).send("Token received successfull")
    } catch (error) {
        console.log(error);
    }
})

router.post("/profile", async (req, res) => {
    isAccessTokenExpired()
    const UserProfile = await axios.get(
        "https://api.spotify.com/v1/me",
        {

            headers: {
                Authorization: "Bearer " + accessToken,
            },
        }
    )
    res.status(200).send(UserProfile.data)
}
)

router.post("/tracks", async (req, res) => {
    const { time_range } = req.body
    console.log(time_range);
    const paramsAxios = new URLSearchParams()
    paramsAxios.append('time_range', time_range)
    paramsAxios.append('limit', 10)

    const Tracks = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks",
        {
            params: paramsAxios,
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        }
    )
    res.status(200).send(Tracks.data.items)
}
)

router.post("/artists", async (req, res) => {
    const { time_range } = req.body
    const paramsAxios = new URLSearchParams()
    paramsAxios.append('time_range', time_range)
    paramsAxios.append('limit', 10)

    const Artists = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
            params: paramsAxios,
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        }
    )
    res.status(200).send(Artists.data.items)
}
)


module.exports = router;
