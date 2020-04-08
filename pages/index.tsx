import React from 'react';
import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import dynamic from 'next/dynamic'

const MyMapView = dynamic(() => import('../components/MyMapView'),  { ssr: false })

interface Props {
	userAgent: string
}

const Home: NextPage<Props> = (props) => {
	console.log(' return ===> ', props);

	return (
		<div>
			<MyMapView />
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
