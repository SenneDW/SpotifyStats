import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import axios from 'axios'
import '../styles/stats.css'
import crown from '../images/crown.png'
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";
import Footer from '../components/Footer/Footer';
import ReactCountryFlag from 'react-country-flag'
import audio from '../images/audio.svg'
function Stats() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null)
    const [currentTrack, setCurrentTrack] = useState(null)
    const [currentTrackLonger, setCurrentTrackLonger] = useState(false)

    const [timeframe, setTimeframe] = useState([true, false, false])
    const [topTracks, setTopTracks] = useState([])
    const [topArtists, setTopArtists] = useState([])
    const [playedToday, setPlayedToday] = useState([])

    const [isLeftButtonDisabled, setIsLeftButtonDisabled] = useState(true);
    const [isRightButtonDisabled, setIsRightButtonDisabled] = useState(false);
    const [isLeftButtonDisabledArtists, setIsLeftButtonDisabledArtists] = useState(true);
    const [isRightButtonDisabledArtists, setIsRightButtonDisabledArtists] = useState(false);
    const [currentPositionTracks, setcurrentPositionTracks] = useState(0);
    const [currentPositionArtists, setcurrentPositionArtists] = useState(0);

    const [widthDisplay, setWidthDisplay] = useState(0)
    const [SCROLLLENGTH, setSCROLLLENGTH] = useState(0)
    const [STEPSIZE, setSTEPSIZE] = useState(0)

    //const SCROLLLENGTH = (220 * 30)
    //const STEPSIZE = SCROLLLENGTH / 5
    const scrollable = useRef(null)
    const scrollableArtists = useRef(null)
    const widthDisplayDiv = useRef(null)

    function getTextWidth(track, artist) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        return context.measureText(track).width + context.measureText(artist).width;
    }
    const defaultDisplay = async () => {
        const profile = JSON.parse(localStorage.getItem('Profile'))
        setProfile(profile)

        await axios.post("http://localhost:8080/api/player/current", {
        }).then((res) => {
            const currentTrack = res.data
            if (currentTrack.currently_playing_type === 'track' && currentTrack.is_playing) {
                setCurrentTrack({ name: currentTrack.item.name, artist: currentTrack.item.artists[0].name, duration_ms: currentTrack.item.duration_ms, progress_ms: currentTrack.progress_ms })
                getTextWidth(currentTrack.item.name, currentTrack.item.artists[0].name) > 350
                    ? setCurrentTrackLonger('currentTrackIsLonger') : setCurrentTrackLonger("")
            }
        })

        await axios.post("http://localhost:8080/api/user/tracks", {
            time_range: 'short_term'
        }).then((res) => {
            displayTracks(res.data)
            localStorage.setItem('short_termTracks', JSON.stringify(res.data))
        })

        await axios.post("http://localhost:8080/api/user/artists", {
            time_range: 'short_term'
        }).then((res) => {
            displayArtists(res.data)
            localStorage.setItem('short_termArtists', JSON.stringify(res.data))
        })

        // await axios.post("http://localhost:8080/api/player/recentlyPlayedToday").then((res) => {})



        setLoading(false)
    }

    const displayTracks = async (tracks) => {
        setTopTracks([])
        for (let index = 0; index < tracks.length; index++) {
            setTopTracks(oldArray => [...oldArray,
            <div ref={widthDisplayDiv} className='containerTopTracksChild' >
                <img key={tracks[index].id} alt='cover track' className='imageCover' src={tracks[index].album.images[0].url} />
                <p>{index + 1}. {tracks[index].name}</p>
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
                <p>{index + 1}. {artists[index].name}</p>
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
            await axios.post(`http://localhost:8080/api/user/tracks`, {
                time_range: time_range
            }).then((res) => {
                localStorage.setItem(`${time_range}Tracks`, JSON.stringify(res.data));
                displayTracks(res.data);
            })

            await axios.post(`http://localhost:8080/api/user/artists`, {
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
        if (currentTrack) {
            let cloneCurrentTrack = {
                ...currentTrack
            }
            console.log("ik ben in useEffect");
            const interval = setInterval(async () => {
                cloneCurrentTrack.progress_ms = cloneCurrentTrack.progress_ms + 1000
                console.log('PROGRESS', cloneCurrentTrack.progress_ms, 'DURATION', cloneCurrentTrack.duration_ms);
                if (currentTrack.duration_ms < cloneCurrentTrack.progress_ms) {
                    console.log("kzen er");
                    await axios.post("http://localhost:8080/api/player/current", {
                    }).then((res) => {
                        const currentTrack = res.data
                        if (currentTrack.currently_playing_type === 'track' && currentTrack.is_playing) {
                            setCurrentTrack({ name: currentTrack.item.name, artist: currentTrack.item.artists[0].name, duration_ms: currentTrack.item.duration_ms, progress_ms: currentTrack.progress_ms })
                            getTextWidth(currentTrack.item.name, currentTrack.item.artists[0].name) > 350
                                ? setCurrentTrackLonger('currentTrackIsLonger') : setCurrentTrackLonger("")
                        }
                    })
                }
            }, [1000]);

            return () => {
                clearInterval(interval)
            }
        }
    }, [currentTrack])



    useEffect(() => {
        if (scrollable.current !== null) {

            if (currentPositionTracks !== SCROLLLENGTH && currentPositionTracks !== 0) {
                setIsRightButtonDisabled(false)
                setIsLeftButtonDisabled(false)
            }
            if (currentPositionTracks === SCROLLLENGTH || currentPositionTracks > SCROLLLENGTH || currentPositionTracks > SCROLLLENGTH - STEPSIZE)
                setIsRightButtonDisabled(true)
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


            if (currentPositionArtists !== SCROLLLENGTH && currentPositionArtists !== 0) {
                setIsRightButtonDisabledArtists(false)
                setIsLeftButtonDisabledArtists(false)
            }
            if (currentPositionArtists === SCROLLLENGTH || currentPositionArtists > SCROLLLENGTH || currentPositionArtists > SCROLLLENGTH - STEPSIZE)
                setIsRightButtonDisabledArtists(true)
            if (currentPositionArtists === 0)
                setIsLeftButtonDisabledArtists(true)

            scrollableArtists.current.scrollTo({
                left: currentPositionArtists,
                behavior: "smooth"
            });
        }// 

    }, [currentPositionArtists])
    useEffect(() => {
        if (scrollable.current) {
            setSCROLLLENGTH(scrollable.current.scrollWidth)
            setSTEPSIZE((scrollable.current.scrollWidth + 10) / 10)
        }
    }, [loading]);

    return (
        <div className='stats'>
            <div className='pagewrapper'>
                {
                    loading ? (<><div className='loading'></div></>) : (
                        <>
                            <div className='containerProfile'>
                                <div className='containerProfileBig'>
                                    <img alt='profilePicture' className='profilePicture' src={profile.profilePicture}></img>
                                    <div className='containerProfileSmall'>
                                        <h1>{profile.display_name}</h1>
                                        <div className='displayCountryFollowers'>
                                            <ReactCountryFlag countryCode={profile.country} svg className='countryFlag' />
                                            <p>{profile.followers} Followers</p>
                                        </div>
                                        {currentTrack !== null ? (<div className='displayCurrentTrack'>
                                            <img className='eqSVG' src={audio} />
                                            <div className='currentTrackContainer'>
                                                <p className={`displayCurrentTrack ${currentTrackLonger}`}>{currentTrack.name} - {currentTrack.artist}</p>
                                            </div>
                                        </div>) : ""}
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