import React from 'react'
import Card from '../Card'
import { useSpring, animated } from 'react-spring'
import { formatNumber } from '../../utils/helpers'
import { countryPointsProps } from '../../pages'

const worldFlag = require('../assets/earth.png')

interface PanelProps {
	panelData: countryPointsProps;
	theme: string;
}

export default function LeftPanel({ panelData, theme }: PanelProps) {

	const getProjectedData = (panelData: countryPointsProps) => {
		if (panelData.oneWeekProjection) {
			let nextFortnight: Array<string> = [], n: string
			for (let i = 0; i < 15; i++) {
				n = (panelData.oneWeekProjection * (0.9 + (Math.random() * 0.2))).toFixed()
				nextFortnight.push(n)
			}
			return nextFortnight
		}
		return []
	}

	const data = {
		labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
		datasets: [
			{
				label: 'Last 14 days',
				fill: true,
				lineTension: 0.5,
				backgroundColor: '',
				borderColor: 'rgba(75,192,192,1)',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: '',
				pointBorderColor: 'rgba(75,192,192,1)',
				pointBackgroundColor: '#fff',
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgba(75,192,192,1)',
				pointHoverBorderColor: 'rgba(220,220,220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: panelData.fortnightCases
			},
			{
				label: 'Next 14 days Projection',
				fill: true,
				lineTension: 0.5,
				backgroundColor: '#026F92',
				borderColor: '#026F92',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: '',
				pointBorderColor: '#026F92',
				pointBackgroundColor: '#fff',
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgba(75,192,192,1)',
				pointHoverBorderColor: 'rgba(220,220,220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: getProjectedData(panelData)
			}
		]
	};

	let animatedProps: Array<Object> = []

	for (let i = 0; i < 8; i++) {
		animatedProps.push(
			useSpring({
				opacity: 1,
				marginLeft: 0,
				delay: 300 * i,
				from: { opacity: 0, marginLeft: -100 * i }
			})
		)
	}

	const CardsClassName = `w-full rounded-lg overflow-hidden shadow-lg mb-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`;

	return (
		<section className={`w-1/4 h-full z-10 absolute left-0 top-0 text-white overflow-y-scroll ${theme === 'dark' ? ' bg-gray-900' : 'bg-gray-400'}`} id="scrollbar">
			<div className="country-bg relative w-full h-40 overflow-y-hidden">
				<img className="w-full opacity-25 -mt-10" src={panelData.flag || worldFlag} alt="Montenegro" />
				<div className="absolute bottom-0 ml-5">
					<h1 className="text-4xl font-bold text-red-600">{formatNumber(panelData.cases)}</h1>
					<h1 className={`text-2xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-900'}`}>Total Cases</h1>
					{panelData.affectedCountries ?
						<>
							<h1 className="text-2xl font-bold text-red-600">{formatNumber(panelData.affectedCountries)}</h1>
							<h1 className={`text-2xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-900'}`}>Affected Countries</h1>
						</>
						:
						<h1 className="text-2xl font-bold text-red-600">{(panelData.country).toUpperCase()}</h1>
					}
				</div>
			</div>
			<div className="mt-10 px-2">
				<animated.div style={animatedProps[0]}>
					<Card className={CardsClassName} stats={[
						{ infoTitle: 'Cases Today', infoNumber: formatNumber(panelData.todayCases) },
						{ infoTitle: 'Deaths Today', infoNumber: formatNumber(panelData.todayDeaths) }
					]} />
				</animated.div>
				<animated.div style={animatedProps[1]}>
					<Card className={CardsClassName} stats={[
						{ infoTitle: 'Tests', infoNumber: formatNumber(panelData.tests) },
						{ infoTitle: 'Tests Per One Million', infoNumber: `≈${formatNumber(panelData.testsPerOneMillion)}` },
					]} />
				</animated.div>
				<Card className={CardsClassName} type="graph" title="Cases Rate" graphData={data} />
				{
					panelData.dropRate &&
					<animated.div style={animatedProps[4]}>
						{panelData.dropRate > 0 ?
							<Card className={CardsClassName} stats={[
								{ infoTitle: 'Projected drop rate', infoNumber: (panelData.dropRate).toFixed(2) },
							]} />
							:
							<Card className={CardsClassName} stats={[
								{ infoTitle: 'Projected increase rate', infoNumber: Math.abs(panelData.dropRate).toFixed(2) },
							]} />
						}
					</animated.div>
				}
				<animated.div style={animatedProps[5]}>
					<Card className={CardsClassName} stats={[
						{ infoTitle: 'Recovered', infoNumber: formatNumber(panelData.recovered) },
						{ infoTitle: 'Active', infoNumber: formatNumber(panelData.active) }
					]} />
				</animated.div>
				<animated.div style={animatedProps[6]}>
					<Card className={CardsClassName} stats={[
						{ infoTitle: 'Critical', infoNumber: formatNumber(panelData.critical) },
						{ infoTitle: 'Deaths Today', infoNumber: formatNumber(panelData.todayDeaths) },
					]} />
				</animated.div>
				<animated.div style={animatedProps[7]}>
					<Card className={CardsClassName} stats={[
						{ infoTitle: 'Deaths', infoNumber: formatNumber(panelData.deaths) },
						{ infoTitle: 'Deaths Per One Million', infoNumber: `≈${formatNumber(panelData.deathsPerOneMillion)}` }
					]} />
				</animated.div>
				<animated.div style={animatedProps[8]}>
					<Card className={CardsClassName} stats={[
						{ infoTitle: 'Cases Per Million', infoNumber: `≈${formatNumber(panelData.casesPerOneMillion)}` },
					]} />
				</animated.div>
			</div>
		</section>
	)
}
