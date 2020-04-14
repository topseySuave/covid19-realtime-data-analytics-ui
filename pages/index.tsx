import React from 'react';
import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import dynamic from 'next/dynamic'
import LeftPanel from '../components/LeftPanel'

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
	}
}

const Home: NextPage<Props> = (props) => {
	return (
		<div className="flex">
			<div className="w-1/4">
				<LeftPanel intialCovData={props.data} />
			</div>
			<div className="flex-1 relative" style={{ width: '100vw', height: '100vh' }}>
				<MapView />
			</div>
		</div>
	);
}

Home.getInitialProps = async ({ req }) => {
	const res = await fetch('https://corona.lmao.ninja/all');
	const data = await res.json();

	return { data };
};

export default Home;
