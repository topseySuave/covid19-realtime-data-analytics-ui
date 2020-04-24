import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import * as d3 from 'd3-ease';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { clusterStyle, groupByCritical } from '../../utils/helpers'
import { CountryProps, countryPointsProps } from '../../pages'

interface Props {
    countriesData: Array<CountryProps>;
    getData: (properties: countryPointsProps) => void;
    changeLeftPanelTheme?: (theme: number) => void;
    activeTheme: number
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
    properties: countryPointsProps;
}

const MapView: React.FC<Props> = (props) => {

    const [state, setState] = useState({
        points: [],
        activeStyle: props.activeTheme,
        mapStyle: props.activeTheme === 1 ? "mapbox://styles/mapbox/dark-v10" : "mapbox://styles/mapbox/light-v10"
    });

    const [viewport, setViewport] = useState({
        latitude: 5,
        longitude: 34,
        width: "100vw",
        height: "100vh",
        zoom: 2,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 1500,
        transitionEasing: d3.easeCubic,
    });

    useEffect(() => {
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(displayLocationInfo);

        function displayLocationInfo(position: Position) {
            const lng: number = position.coords.longitude;
            const lat: number = position.coords.latitude;

            setViewport({
                ...viewport,
                latitude: lat,
                longitude: lng,
                zoom: 4,
            })
        }
    }, []);

    const { countriesData, getData, changeLeftPanelTheme } = props
    const data: any = countriesData.length > 0 ? countriesData : [];
    const points = data.map((country: CountryProps) => ({
        type: "Feature",
        properties: {
            cluster: false,
            id: country.ID,
            category: groupByCritical(country.CasesPerOneMillion),
            cases: country.Cases,
            todayCases: country.TodayCases,
            casesPerMillion: country.CasesPerOneMillion,
            country: country.Country,
            updated: country.Updated,
            deaths: country.Deaths,
            todayDeaths: country.TodayDeaths,
            recovered: country.Recovered,
            active: country.Active,
            critical: country.Critical,
            casesPerOneMillion: country.CasesPerOneMillion,
            deathsPerOneMillion: country.DeathsPerOneMillion,
            tests: country.Tests,
            testsPerOneMillion: country.TestsPerOneMillion,
            affectedCountries: country.AffectedCountries,
            flag: country.CountryInfo.Flag,
            fortnightCases: country.FortnightCases,
            dropRate: country.DropRate,
            oneWeekProjection: country.OneWeekProjection
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

    const changeMapTheme = (mapStyle: string, activeStyle: number) => {
        changeLeftPanelTheme(activeStyle)
        setState({
            ...state,
            mapStyle,
            activeStyle
        })

        if (localStorage.getItem('cov-theme') !== activeStyle.toString()) {
            localStorage.setItem('cov-theme', activeStyle.toString())
        }
    }

    const dataPoints = state.points && state.points.length > 1 ? state.points : points

    const sortByCategory = (category: string) => {
        const results = points.filter((data: DataPointProps) => data.properties.category == category)
        setState({
            ...state,
            points: results
        })
    }

    const addClass = (activeStyle: number) => {
        return [`rounded-full h-fit-content py-1 px-5 ${state.activeStyle === activeStyle ? 'bg-gray-800' : 'bg-transparent'}`].join()
    }

    return (
        <>
            <div className='sidebarStyle w-3/4 flex justify-between'>
                <div className="border border-gray-200 bg-gray-700 rounded-full h-fit-content ml-5">
                    <button className={addClass(0)} onClick={() => changeMapTheme('mapbox://styles/mapbox/light-v10', 0)}><FontAwesomeIcon size="lg" icon={faSun} /></button>
                    <button className={addClass(1)} onClick={() => changeMapTheme('mapbox://styles/mapbox/dark-v10', 1)}> <FontAwesomeIcon size="lg" icon={faMoon} /></button>
                </div>
                <div className="">
                    <p className={[`${state.activeStyle === 0 && 'text-black'}`].join()}>Sort By:</p>
                    <button className="border border-green-600 text-white bg-gray-700 opacity-75 rounded-full py-1 px-5 mr-2" onClick={() => sortByCategory("Minor")}> Minor</button>
                    <button className="border border-yellow-500 text-white bg-gray-700 opacity-75 rounded-full py-1 px-5 mr-2" onClick={() => sortByCategory("Moderate")}>Moderate</button>
                    <button className="border border-orange-600 bg-gray-700 opacity-75 rounded-full py-1 px-5 mr-2" onClick={() => sortByCategory("Considerable")}> Considerable</button>
                    <button className="border border-red-600 bg-gray-700 opacity-75 rounded-full py-1 px-5 mr-2" onClick={() => sortByCategory("Critical")}> Critical</button>
                    <button className="border border-gray-200 bg-gray-700 opacity-75 rounded-full py-1 px-5 mr-2" onClick={() => sortByCategory("")}> All</button>
                </div>
            </div>
            <ReactMapGL
                {...viewport}
                maxZoom={30}
                mapboxApiAccessToken={process.env.MAP_BOX_TOKEN}
                onViewportChange={(newViewport: any) => setViewport({ ...newViewport })}
                mapStyle={state.mapStyle ? state.mapStyle : "mapbox://styles/mapbox/dark-v10"}
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
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => getData(point.properties)}
                                >
                                    {cases}
                                </div>
                            </Marker>
                        )
                    }
                }
                )}
            </ReactMapGL>
        </>
    );

}

export default MapView