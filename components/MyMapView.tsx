import React, { useState, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

const MyMapView = (props) => {

    mapboxgl.accessToken = process.env.MAP_BOX_TOKEN;
    let mapContainer, markerPointer;

    const [state, setState] = useState({
        lng: 5,
        lat: 34,
        zoom: 2,
        mapStyle: 'mapbox://styles/mapbox/dark-v10'
    })

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer,
            style: state.mapStyle,
            center: [state.lng, state.lat],
            zoom: state.zoom
        });
        map.on('move', () => {
            setState({
                ...state,
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2),
            })
        })

        new mapboxgl.Marker(markerPointer)
            .setLngLat([state.lng, state.lat])
            .addTo(map);

    }, [])

    console.log(' return ===> ', props);

    const changeToDark = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (state.mapStyle === 'mapbox://styles/mapbox/dark-v10') return;
        return setState({
            ...state,
            mapStyle: 'mapbox://styles/mapbox/dark-v10'
        })
    }

    const changeToStreet = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setState({
            ...state,
            mapStyle: 'mapbox://styles/mapbox/streets-v11'
        })
    }

    console.log(state);

    return (
        <div>
            <div className="marker" ref={mark => markerPointer = mark} />
            <div className='sidebarStyle'>
                <div>Longitude: {state.lng} | Latitude: {state.lat} | Zoom: {state.zoom}</div>
                <button className="btn" onClick={changeToStreet}> change to street</button>
                <button className="btn" onClick={changeToDark}> change to dark</button>
            </div>
            <div ref={el => mapContainer = el} className='mapContainer' />
        </div>
    );
};

export default MyMapView