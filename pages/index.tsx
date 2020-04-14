import React from 'react';
import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import dynamic from 'next/dynamic'
import LeftPanel from '../components/LeftPanel'

const MapView = dynamic(() => import('../components/MapView'), { ssr: false })

interface Props {
	userAgent: string
}

const Home: NextPage<Props> = (props) => {
	// console.log(' return ===> ', props);

	return (
		<div className="flex">
			<div className="w-1/4">
				<LeftPanel />
  		</div>
			<div className="flex-1">
				<MapView />
  		</div>
		</div>
	);
}

Home.getInitialProps = async ({ req }) => {
	const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
	const res = await fetch('https://corona.lmao.ninja/countries');
	const data = await res.json();

	return { userAgent, data };
};

export default Home;
