const express = require("express");
const axios = require("axios");
const { getAccessToken } = require("../module/tokens");
const router = express.Router();

router.post("/recentlyPlayedToday", async (req, res) => {
    const paramsAxios = new URLSearchParams()
    let date = new Date()
    date.setHours(0, 0, 0, 0)
    let timestamp = date.getTime() / 1000
    console.log(timestamp);
    paramsAxios.append('limit', 50)
    //paramsAxios.append('before', timestamp)
    paramsAxios.append('after', timestamp)

    const recentlyPlayedToday = await axios.get(
        "https://api.spotify.com/v1/me/player/recently-played",
        {
            params: paramsAxios,
            headers: {
                Authorization: "Bearer " + getAccessToken(),
            },
        }
    )
    res.status(200).send(recentlyPlayedToday.data)
})

router.post("/current", async (req, res) => {
    const paramsAxios = new URLSearchParams()
    const CurrentSong = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
            params: paramsAxios,
            headers: {
                Authorization: "Bearer " + getAccessToken(),
            },
        }
    )
    res.status(200).send(CurrentSong.data)
})

module.exports = router;
