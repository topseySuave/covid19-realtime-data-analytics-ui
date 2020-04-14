import React from 'react'
import Card from '../Card'
import { formatNumber } from '../../utils/helpers'
const worldFlag = require('../assets/earth.png')

export const Divider = () => (
	<div className="w-full rounded-lg overflow-hidden shadow-lg bg-gray-800 mb-2">
		<div className="px-2 py-2" />
	</div>
);
// https://particles.matteobruni.it/images/sars-cov-2.png

export default function LeftPanel({ intialCovData }) {
	const data = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
		datasets: [
			{
				label: 'Increase Rate',
				fill: true,
				lineTension: 0.5,
				backgroundColor: 'rgba(75,192,192,0.4)',
				borderColor: 'rgba(75,192,192,1)',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: 'rgba(75,192,192,1)',
				pointBackgroundColor: '#fff',
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgba(75,192,192,1)',
				pointHoverBorderColor: 'rgba(220,220,220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: [65, 59, 80, 81, 56, 55, 40]
			}
		]
	};

	return (
		<>
			<section className="w-1/4 h-full bg-gray-900 z-10 absolute left-0 top-0 text-white overflow-y-scroll" id="scrollbar">
				<div className="country-bg relative w-full h-40 overflow-y-hidden">
					<img className="w-full opacity-50 -mt-10" src={worldFlag} alt="Montenegro" />
					<div className="absolute bottom-0 ml-5">
						<h1 className="text-4xl text-white font-bold">{formatNumber(intialCovData.cases)}</h1>
						<h1 className="text-2xl text-white">Total Cases</h1>
					</div>
				</div>
				<div className="mt-10 px-2">
					<Card stats={[
						{ infoTitle: 'Cases Today', infoNumber: formatNumber(intialCovData.todayCases) },
						{ infoTitle: 'Deaths Today', infoNumber: formatNumber(intialCovData.todayDeaths) }
					]} />
					<Divider />
					<Card stats={[
						{ infoTitle: 'Affected Countries', infoNumber: formatNumber(intialCovData.affectedCountries) },
						{ infoTitle: 'Tests', infoNumber: formatNumber(intialCovData.tests) }
					]} />
					<Divider />
					<Card type="graph" title="Increase Rate" graphData={data} />
					<Divider />
					<Card stats={[
						{ infoTitle: 'Recovered', infoNumber: formatNumber(intialCovData.recovered) },
						{ infoTitle: 'Active', infoNumber: formatNumber(intialCovData.active) }
					]} />
					<Divider />
					<Card stats={[
						{ infoTitle: 'Critical', infoNumber: formatNumber(intialCovData.critical) },
						{ infoTitle: 'Cases Per Million', infoNumber: formatNumber(intialCovData.casesPerOneMillion) }
					]} />
					<Divider />
					<Card stats={[
						{ infoTitle: 'Tests Per One Million', infoNumber: formatNumber(intialCovData.testsPerOneMillion) },
						{ infoTitle: 'Deaths Per One Million', infoNumber: formatNumber(intialCovData.deathsPerOneMillion) }
					]} />
				</div>
			</section>
		</>
	)
}
