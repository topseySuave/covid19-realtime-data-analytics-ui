import React, { useState, useEffect, useRef } from 'react'
import ReactMapGL, { Marker } from "react-map-gl";
import { clusterStyle, groupByCritical } from '../../utils/helpers'

const MapView = (props) => {

  const [viewport, setViewport] = useState({
    latitude: 5,
    longitude: 34,
    width: "100vw",
    height: "100vh",
    zoom: 2,
    transitionInterpolator: null,
    transitionDuration: "auto",
    points: []
  });

  useEffect(() => {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(displayLocationInfo);
    
    function displayLocationInfo(position) {
      const lng: number = position.coords.longitude;
      const lat: number = position.coords.latitude;
    
      setViewport({
        latitude: lat,
        longitude: lng,
        width: "100vw",
        height: "100vh",
        zoom: 3,
        transitionInterpolator: null,
        transitionDuration: "auto",
        points: []
      })
      }
    }, []);

  const { countriesData } = props
  const data: any = countriesData.length > 0 ? countriesData : [];
  const points = data.map(country => ({
    type: "Feature",
    properties: {
        cluster: false,
        id: country.ID,
        category: groupByCritical(country.CasesPerOneMillion),
        cases: country.Cases,
        casesPerMillion: country.CasesPerOneMillion
    },
    geometry: {
      type: "Point",
      coordinates: [
        country.CountryInfo.Long,
        country.CountryInfo.Lat
      ]
    }
  }
  ));

  const dataPoints = viewport.points && viewport.points.length > 1 ? viewport.points : points

  const sortByCategory = (category) => {
    const results = dataPoints.filter(data => data.properties.category == category)
    setViewport({
      ...viewport,
      points: results
    })
  }

  return (
    <ReactMapGL
      {...viewport}
      maxZoom={30}
      mapboxApiAccessToken={process.env.MAP_BOX_TOKEN}
      onViewportChange={newViewport => {
        setViewport({ ...newViewport });
      }}
    >
      <div>
        <div className='sidebarStyle'>
          <button className="btn1"  onClick={()=>{sortByCategory("Minor")}}> Minor</button>
        </div>
        <div className='sidebarStyle'>
          <button className="btn2"  onClick={()=>{sortByCategory("Moderate")}}> Moderate</button>
        </div>
        <div className='sidebarStyle'>
          <button className="btn3" onClick={()=>{sortByCategory("Considerable")}}> Considerable</button>
        </div>
        <div className='sidebarStyle'>
          <button className="btn4" onClick={()=>{sortByCategory("Critical")}}> Critical</button>
        </div>
      </div>

      {dataPoints.map(point => {
      {
        const [longitude, latitude] = point.geometry.coordinates;
        const { id, cases, casesPerMillion } = point.properties;
        const { backgroundColor, size, fontSize } : any = clusterStyle(casesPerMillion)

        return(
          <Marker
            key={id}
            latitude={latitude}
            longitude={longitude}
            >
              <div
                className="cluster-marker"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor,
                  fontSize: `${fontSize}px`
                }}
                // onClick={() => {
                //   console.log("Country>>", point.Country)

                  // setViewport({
                  //   ...viewport,
                  //   latitude,
                  //   longitude,
                  //   zoom: viewport.zoom + 1,
                    // transitionInterpolator: new FlyToInterpolator({
                    //   speed: 2
                    // }),
                    // transitionDuration: "auto"
                //   });
                // }}
              >
                {cases}
              </div>
          </Marker>)}}
      )}
    </ReactMapGL>
  );

}

export default MapView