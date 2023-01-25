import React, { useState } from 'react';


const BackgroundVideo = (code: any) => {
    // Convert from object to string
    code = code.code
    const videoURL = getVideoUrl(code);
    console.log(videoURL)
    return (
        <video playsInline loop muted autoPlay src={getVideoUrl(code)} />
    )
}

function getVideoUrl(weatherCode: any) {
            switch (weatherCode) {
            case 'clear':
            return '/Videos/clear.mp4';
            case 'clouds':
            return '/Videos/clouds.mp4';
            case 'rain':
            return '/Videos/rain.mp4';
            case 'snow':
            return '/Videos/snow.mp4';
            case 'mist':
            return '/Videos/mist.mp4';
            default:
            return '/Videos/default.mp4';
        }
        }

export default BackgroundVideo;