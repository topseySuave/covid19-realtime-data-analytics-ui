import React, { useState, useEffect, useRef } from 'react'
import ReactMapGL, { Marker, ViewportProps, FlyToInterpolator } from "react-map-gl";
import * as d3 from 'd3-ease';
import { clusterStyle, groupByCritical } from '../../utils/helpers'

interface Props {
    countriesData: any;
    getData: any
}
interface CountryProps {
    ID: any;
    Country: string;
    CasesPerOneMillion: number;
    Cases: number;
    TodayCases: number;
    Updated: number;
    Deaths: number;
    TodayDeaths: number;
    Recovered: number;
    Active: number;
    Critical: number;
    DeathsPerOneMillion: number;
    Tests: number;
    TestsPerOneMillion: number;
    AffectedCountries: number;
    FortnightCases: Array<number>;
    DropRate: number;
    OneWeekProjection: number;
    CountryInfo: {
        Long: number;
        Lat: number;
        Flag: string
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
        country: string;
        todayCases: number;
        updated: number;
        deaths: number;
        todayDeaths: number;
        recovered: number;
        active: number;
        critical: number;
        casesPerOneMillion: number;
        deathsPerOneMillion: number;
        tests: number;
        testsPerOneMillion: number;
        affectedCountries: number;
        flag: string;
        fortnightCases: Array<number>;
        dropRate: number;
        oneWeekProjection: number;
    };
}

const MapView: React.FC<Props> = (props) => {

    const [state, setState] = useState({
        points: [],
        mapStyle: "mapbox://styles/mapbox/dark-v10"
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

    const { countriesData, getData } = props
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

    const changeMapTheme = () => {
      setState({
          ...state,
        mapStyle: state.mapStyle == "mapbox://styles/mapbox/streets-v11" ? 
        'mapbox://styles/mapbox/dark-v10' : "mapbox://styles/mapbox/streets-v11"
      })
    }

    const dataPoints = state.points && state.points.length > 1 ? state.points : points

    const sortByCategory = (category: string) => {
        const results = points.filter((data: DataPointProps) => data.properties.category == category)
        setState({
            ...state,
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
                <button onClick={changeMapTheme}> Change Map Theme</button>
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