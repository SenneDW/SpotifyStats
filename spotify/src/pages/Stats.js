import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import '../styles/stats.css'
import crown from '../images/crown.png'
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";
import Footer from '../components/Footer/Footer';
function Stats() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null)
    const [timeframe, setTimeframe] = useState([true, false, false])
    const [topTracks, setTopTracks] = useState([])
    const [topArtists, setTopArtists] = useState([])
    const [isLeftButtonDisabled, setIsLeftButtonDisabled] = useState(true);
    const [isRightButtonDisabled, setIsRightButtonDisabled] = useState(false);
    const [isLeftButtonDisabledArtists, setIsLeftButtonDisabledArtists] = useState(true);
    const [isRightButtonDisabledArtists, setIsRightButtonDisabledArtists] = useState(false);
    const [currentPositionTracks, setcurrentPositionTracks] = useState(0);
    const [currentPositionArtists, setcurrentPositionArtists] = useState(0);

    const SCROLLLENGTH = (220 * 10 / 2) + 40
    const STEPSIZE = SCROLLLENGTH / 2
    const scrollable = useRef(null)
    const scrollableArtists = useRef(null)


    const defaultDisplay = async () => {
        const profile = JSON.parse(localStorage.getItem('Profile'))
        setProfile(profile)
        await axios.post("http://localhost:8080/api/code/tracks", {
            time_range: 'short_term'
        }).then((res) => {
            displayTracks(res.data)
            localStorage.setItem('short_termTracks', JSON.stringify(res.data))
        })

        await axios.post("http://localhost:8080/api/code/artists", {
            time_range: 'short_term'
        }).then((res) => {
            displayArtists(res.data)
            localStorage.setItem('short_termArtists', JSON.stringify(res.data))
        })
        setLoading(false)

    }

    const displayTracks = async (tracks) => {
        setTopTracks([])
        for (let index = 0; index < tracks.length; index++) {
            setTopTracks(oldArray => [...oldArray,
            <div className='containerTopTracksChild' >
                <img key={tracks[index].id} alt='cover track' className='imageCover' src={tracks[index].album.images[0].url} />
                <p>{tracks[index].name}</p>
            </div>
            ]);
        }
    }
    const displayArtists = async (artists) => {
        setTopArtists([])
        for (let index = 0; index < artists.length; index++) {
            setTopArtists(oldArray => [...oldArray,
            <div className='containerTopTracksChild' >
                <img key={artists[index].id} alt='cover track' className='imageCover' src={artists[index].images[0].url} />
                <p>{artists[index].name}</p>
            </div>
            ]);
        }
    }

    const changeTimeframe = async (time_range) => {
        setIsLeftButtonDisabled(true)
        setIsRightButtonDisabled(false)
        setcurrentPositionArtists(0)
        setcurrentPositionTracks(0)
        setTopTracks([])
        setTopArtists([])

        if (localStorage.getItem(`${time_range}Tracks`)) {
            displayTracks(JSON.parse(localStorage.getItem(`${time_range}Tracks`)))
            displayArtists(JSON.parse(localStorage.getItem(`${time_range}Artists`)))
        } else {
            await axios.post(`http://localhost:8080/api/code/tracks`, {
                time_range: time_range
            }).then((res) => {
                localStorage.setItem(`${time_range}Tracks`, JSON.stringify(res.data));
                displayTracks(res.data);
            })

            await axios.post(`http://localhost:8080/api/code/artists`, {
                time_range: time_range
            }).then((res) => {
                localStorage.setItem(`${time_range}Artists`, JSON.stringify(res.data));
                displayArtists(res.data);
            })

        }
        setTimeframe([
            time_range === 'short_term',
            time_range === 'medium_term',
            time_range !== 'short_term' && time_range !== 'medium_term',
        ]);
    }

    const scrollIt = (toRight) => {
        toRight ? setcurrentPositionTracks(currentPositionTracks + STEPSIZE) : setcurrentPositionTracks(currentPositionTracks - STEPSIZE)
    }
    const scrollItArtists = (toRight) => {
        toRight ? setcurrentPositionArtists(currentPositionArtists + STEPSIZE) : setcurrentPositionArtists(currentPositionArtists - STEPSIZE)
    }

    useEffect(() => {
        let isCancelled = false
        if (!isCancelled)
            defaultDisplay()
        return () => {
            isCancelled = true
        }
    }, [])


    useEffect(() => {
        if (scrollable.current !== null) {
            if (currentPositionTracks === SCROLLLENGTH)
                setIsRightButtonDisabled(true)

            if (currentPositionTracks !== SCROLLLENGTH && currentPositionTracks !== 0) {
                setIsRightButtonDisabled(false)
                setIsLeftButtonDisabled(false)
            }

            if (currentPositionTracks === 0)
                setIsLeftButtonDisabled(true)

            scrollable.current.scrollTo({
                left: currentPositionTracks,
                behavior: "smooth"
            });
        }

    }, [currentPositionTracks])

    useEffect(() => {
        if (scrollableArtists.current !== null) {
            if (currentPositionArtists === SCROLLLENGTH)
                setIsRightButtonDisabledArtists(true)

            if (currentPositionArtists !== SCROLLLENGTH && currentPositionArtists !== 0) {
                setIsRightButtonDisabledArtists(false)
                setIsLeftButtonDisabledArtists(false)
            }

            if (currentPositionArtists === 0)
                setIsLeftButtonDisabledArtists(true)

            scrollableArtists.current.scrollTo({
                left: currentPositionArtists,
                behavior: "smooth"
            });
        }

    }, [currentPositionArtists])

    return (
        <div className='stats'>
            <div className='pagewrapper'>
                {
                    loading ? (<></>) : (
                        <>
                            <div className='containerProfile'>
                                <div className='containerProfileBig'>
                                    <img alt='profilePicture' className='profilePicture' src={profile.profilePicture}></img>
                                    <div className='containerProfileSmall'>
                                        <h1>{profile.display_name}</h1>
                                        <p>{profile.followers} Followers</p>
                                    </div>
                                </div>
                                {profile.product === 'premium' ? (<><div className='containerProduct'><img alt='crown' className='crown' src={crown} /> <span className='profileProduct profilePremium'>{profile.product}</span></div></>) : (<span className='profileProduct'>{profile.product}</span>)}
                            </div>
                            <div className='containerTimeframes'>
                                <p onClick={() => changeTimeframe('short_term')} className={`timeframeP ${timeframe[0] ? 'activeTimeframe' : 'inActiveTimeframe'}`}>4 Weeks</p>
                                <p onClick={() => changeTimeframe('medium_term')} className={`timeframeP ${timeframe[1] ? 'activeTimeframe' : 'inActiveTimeframe'}`}>6 Months</p>
                                <p onClick={() => changeTimeframe('long_term')} className={`timeframeP ${timeframe[2] ? 'activeTimeframe' : 'inActiveTimeframe'}`}>Lifetime</p>
                            </div>
                            <div className='containerTopTracksArrows'>
                                <h2 className='firstH2'>Top Tracks</h2>
                                <div>
                                    <IoIosArrowDropleftCircle className={`arrow ${isLeftButtonDisabled ? 'disabled' : 'enabled'}`} onClick={() => scrollIt(false)} />
                                    <IoIosArrowDroprightCircle className={`arrow ${isRightButtonDisabled ? 'disabled' : 'enabled'}`}
                                        onClick={() => scrollIt(true)} />
                                </div>
                            </div>
                            <div className='containerTopTracks' ref={scrollable}>
                                {topTracks}
                            </div>
                            <div className='containerTopTracksArrows'>
                                <h2>Top Artists</h2>
                                <div>
                                    <IoIosArrowDropleftCircle className={`arrow ${isLeftButtonDisabledArtists ? 'disabled' : 'enabled'}`} onClick={() => scrollItArtists(false)} />
                                    <IoIosArrowDroprightCircle className={`arrow ${isRightButtonDisabledArtists ? 'disabled' : 'enabled'}`}
                                        onClick={() => scrollItArtists(true)} />
                                </div>
                            </div>
                            <div className='containerTopTracks' ref={scrollableArtists}>
                                {topArtists}
                            </div>
                        </>
                    )
                }
            </div>
            <Footer />
        </div>
    )
}


export default Stats