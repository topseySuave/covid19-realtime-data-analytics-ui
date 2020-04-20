import React, { useState, useEffect, useRef } from 'react'
import ReactMapGL, { Marker, ViewportProps, FlyToInterpolator } from "react-map-gl";
import * as d3 from 'd3-ease';
import { clusterStyle, groupByCritical } from '../../utils/helpers'

interface Props {
    countriesData: any;
}
interface CountryProps {
    ID: any;
    CasesPerOneMillion: number;
    Cases: number;
    CountryInfo: {
        Long: number;
        Lat: number;
    };
}

interface DataPointProps {
    properties: {
        category: string;
    };
}

interface PointProps {
    geometry: {
        coordinates: [number, number];
    };
    properties: {
        id: string;
        cases: number;
        casesPerMillion: number;
    };
}

const MapView: React.FC<Props> = (props) => {

    const [state, setState] = useState({
        points: []
    });

    const [viewport, setViewport] = useState({
        latitude: 5,
        longitude: 34,
        width: "100vw",
        height: "100vh",
        zoom: 2,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 1500,
        transitionEasing: d3.easeCubic
    });

    useEffect(() => {
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(displayLocationInfo);

        function displayLocationInfo(position: Position) {
            const lng: number = position.coords.longitude;
            const lat: number = position.coords.latitude;

            setViewport({
                latitude: lat,
                longitude: lng,
                width: "100vw",
                height: "100vh",
                zoom: 4,
                transitionInterpolator: new FlyToInterpolator(),
                transitionDuration: 1500,
                transitionEasing: d3.easeCubic
            })
        }
    }, []);

    const { countriesData } = props
    const data: any = countriesData.length > 0 ? countriesData : [];
    const points = data.map((country: CountryProps) => ({
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

    const dataPoints = state.points && state.points.length > 1 ? state.points : points

    const sortByCategory = (category: string) => {
        const results = points.filter((data: DataPointProps) => data.properties.category == category)
        setState({
            ...viewport,
            points: results
        })
    }

    return (
        <>
            <div className='sidebarStyle'>
                <p>Sort By: </p>
                <button onClick={() => sortByCategory("Minor")}> Minor</button>
                <button onClick={() => sortByCategory("Moderate")}> Moderate</button>
                <button onClick={() => sortByCategory("Considerable")}> Considerable</button>
                <button onClick={() => sortByCategory("Critical")}> Critical</button>
                <button onClick={() => sortByCategory("")}> Clear</button>
            </div>
            <ReactMapGL
                {...viewport}
                maxZoom={30}
                mapboxApiAccessToken={process.env.MAP_BOX_TOKEN}
                onViewportChange={(newViewport: any) => setViewport({ ...newViewport })}
                mapStyle="mapbox://styles/mapbox/dark-v10"
            >
                {dataPoints.map((point: PointProps) => {
                    {
                        const [longitude, latitude] = point.geometry.coordinates;
                        const { id, cases, casesPerMillion } = point.properties;
                        const { backgroundColor, size, fontSize }: any = clusterStyle(casesPerMillion)

                        return (
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
                                        fontSize: `${fontSize}em`,
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
                            </Marker>)
                    }
                }
                )}
            </ReactMapGL>
        </>
    );

}

export default MapView