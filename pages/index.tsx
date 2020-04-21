import React, { useState } from 'react';
import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import dynamic from 'next/dynamic'
import LeftPanel from '../components/LeftPanel'
import { arraySubtraction } from '../utils/helpers'

const MapView = dynamic(() => import('../components/MapView'), { ssr: false })

interface Props {
	data: {
		updated: number,
		cases: number,
		todayCases: number,
		deaths: number,
		todayDeaths: number,
		recovered: number,
		active: number,
		critical: number,
		casesPerOneMillion: number,
		deathsPerOneMillion: number,
		tests: number,
		testsPerOneMillion: number,
		affectedCountries: number
	},
	countries: any,
	history: any
}

const Home: NextPage<Props> = (props) => {


	const [state, setState] = useState({
		countryData: null
	})

	const getData = (countryData) => {
		setState({countryData})
	}

	const handleHistory = (props) =>{
		let history = {
			fortnightCases : arraySubtraction(
			Object.values(
				props["cases"])
				.slice(1).slice(-15)
				.sort((a: number, b: number) => a-b
				))
		}
		return history
	} 

	return (
		<div className="flex">
			<div className="w-1/4">
				<LeftPanel
					panelData={state.countryData || {...handleHistory(props.history), ...props.data}} 
				/>
			</div>
			<div className="flex-1 relative" style={{ width: '100vw', height: '100vh' }}>
				<MapView 
					countriesData={props.countries}
					getData={getData}
				/>
			</div>
		</div>
	);
}

Home.getInitialProps = async ({ req }) => {
	const res = await fetch(process.env.GET_ALL_COUNTRIES);
	const countriesData = await fetch(process.env.GET_COUNTRIES_DATA)
	const worldHistory = await fetch(process.env.GET_WORLD_HISTORY)
	const data = await res.json();
	const countries = await countriesData.json()
	const history = await worldHistory.json()

	return { data, countries, history };
};

export default Home;
