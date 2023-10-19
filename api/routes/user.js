const express = require("express");
const axios = require("axios");
const { getAccessToken } = require("../module/tokens");
const router = express.Router();



router.post("/profile", async (req, res) => {
    const UserProfile = await axios.get(
        "https://api.spotify.com/v1/me",
        {
            headers: {
                Authorization: "Bearer " + getAccessToken(),
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
    paramsAxios.append('limit', 50)

    const Tracks = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks",
        {
            params: paramsAxios,
            headers: {
                Authorization: "Bearer " + getAccessToken(),
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
    paramsAxios.append('limit', 50)

    const Artists = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
            params: paramsAxios,
            headers: {
                Authorization: "Bearer " + getAccessToken(),
            },
        }
    )
    res.status(200).send(Artists.data.items)
}
)







module.exports = router;
