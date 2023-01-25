import Head from 'next/head'
import styles from '../styles/Home.module.css'
import BackgroundVideo from "../components/BackgroundVideo";
import {forwardRef, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import ReactAudioPlayer from 'react-audio-player';


// @ts-ignore
export default function Home({weather, city}) {

    const code = weather.current.weather[0].main.toLowerCase()
    const temp = Math.round(weather.current.temp * 9/5 + 32)
    const [weatherCode, setWeatherCode] = useState(code)
    const [temperature, setTemperature] = useState(temp)
    const [weatherDescription, setWeatherDescription] = useState(weather.current.weather[0].description)
    const [cityName, setCity] = useState()

    useEffect(() => {
        if (city.results[2] !== undefined) {
            setCity(city.results[2].formatted_address.toString())
        }
    }, [city.results])





    const handleClick = async (e: { lat: any; lng: any; }) => {
        const weather = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${e.lat}&lon=${e.lng}&exclude=hourly,minutely&appid=9c4a134f0d4c8c61cc30a7404d4854ad&units=metric`)
        const weatherJson = await weather.json()
        const googleMapsKey= 'AIzaSyDvS1JSabFesYWh1bVRLBO_U65F5ONCRug'
        const city = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.lat},${e.lng}&key=${googleMapsKey}`)
        const cityJson = await city.json()
        console.log(cityJson)
        if (cityJson !== undefined) {
            if (cityJson.results[0] !== undefined) {
                if (cityJson.results.length > 2) {
                    setCity(cityJson.results[2].formatted_address.toString())
                }
                else {
                    setCity(undefined)
                }
            }
        }


        console.log(weatherJson)
        setWeatherCode(weatherJson.current.weather[0].main.toLowerCase())
        setTemperature(Math.round(weatherJson.current.temp * 9/5 + 32))
        setWeatherDescription(weatherJson.current.weather[0].description)
    }




  // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
    <div className={styles.container}>

        <Head>
        <title>Climate Compass</title>
        <meta name="description" content="Explore the weather on the other side of the world." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className={styles.main}>
            <div className={styles.videoContainer}>
                <ReactAudioPlayer
                    src={`/Audio/${weatherCode}.wav`}
                    autoPlay
                    loop
                    volume={0.25}
                />
            <BackgroundVideo className={styles.videoBackground} code={weatherCode}>  </BackgroundVideo>
            </div>
            <h1 className={styles.title}>

                Climate Compass
            </h1>
            <p className={styles.description}>
                It is currently {temperature}°F and {weatherDescription} {cityName === undefined ? 'there. ' : `In ${cityName},`}
            </p>
            <Globe
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundColor="rgba(0, 0, 0, 0)"
                waitForGlobeReady={true}
                width={500}
                height={500}
                onGlobeClick={handleClick}
            ></Globe>
        </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}


export async function getServerSideProps() {
  let location = [0, 0]
    const ip = await fetch('https://api.ipify.org')
        .then(function(response) { return response.text(); })
    await fetch(`https://api.geoapify.com/v1/ipinfo?apiKey=a67884f32b9b41a3ad498488b0b983e3&ip=${ip}`, {
        method: 'GET'
    })
        .then(function(response) { return response.json(); })
        .then(function(json) {
            location = [json.location.latitude, json.location.longitude]
        });

  const weather = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${location[0]}&lon=${location[1]}&exclude=hourly,minutely&appid=9c4a134f0d4c8c61cc30a7404d4854ad&units=metric`)
   const googleMapsKey= 'AIzaSyDvS1JSabFesYWh1bVRLBO_U65F5ONCRug'
    const city = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location[0]},${location[1]}&key=${googleMapsKey}`)
        .then(function(response) { return response.json(); })
        .then(function(json) {
            console.log(json)
            return json
        }
    );

    return {
        props: {
            location: location,
            weather: await weather.json(),
            city: city
        }
    }
}


const GlobeTmpl = dynamic(() => import("../components/globe"), {
    ssr: false,
});



// eslint-disable-next-line react/display-name
const Globe = forwardRef((props: any, ref) => (
    <GlobeTmpl {...props} forwardRef={ref} />
));

function getVideoUrl(weatherCode: any) {
    switch (weatherCode) {
        case 'clear':
            return 'https://example.com/clear.mp4';
        case 'clouds':
            return 'https://example.com/clouds.mp4';
        case 'rain':
            return 'https://example.com/rain.mp4';
        case 'snow':
            return 'https://example.com/snow.mp4';
        default:
            return 'https://example.com/default.mp4';
    }
}

