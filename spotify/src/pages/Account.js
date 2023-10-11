import React, { useEffect } from 'react'
import axios from 'axios'

function Account() {
    const params = new URLSearchParams(window.location.search);
    const sendCodeToBackEnd = async () => {
        await axios.post("http://localhost:8080/api/code/getTokens", {
            code: params.get("code")
        }).then(async (res) => {
            if (res.status == 200) {
                await axios.post("http://localhost:8080/api/code/profile").then((res) => {
                    let data = res.data
                    localStorage.setItem('Profile', JSON.stringify({
                        display_name: data.display_name,
                        followers: data.followers.total,
                        profilePicture: data.images[1].url,
                        product: data.product

                    })

                    )
                    window.location.href = `http://localhost:3000/${data.id}`
                })

            }
        })
    }

    useEffect(() => {
        let isCancelled = false
        if (!isCancelled) {
            sendCodeToBackEnd()
        }
        return () => {
            isCancelled = true
        }
    }, [])

    return (
        <div className='stats'>

        </div>
    )
}

export default Account