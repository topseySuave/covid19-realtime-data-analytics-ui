import React, { ReactText } from 'react'
import { Line } from 'react-chartjs-2'

interface Props {
	infoTitle: string,
	infoNumber: string,
}

type Datasets = {
	[k in string | number]: any;
};

interface Data {
	stats?: Array<Props>;
	type?: 'graph' | 'infoStat';
	title?: string;
	graphData?: {
		labels: Array<String>;
		datasets: Array<Datasets>;
	}
}

export const Card: React.FC<Data> = ({ stats, title, type, graphData }) => {
	if (type && type === 'graph') {
		return (
			<div className="w-full rounded-lg overflow-hidden shadow-lg bg-gray-800 mb-2">
				<div className="px-2 py-2">
					<Line data={graphData} height={250} />
					<p className="text-center text-gray-500 text-base">{title}</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="w-full rounded-lg overflow-hidden shadow-lg bg-gray-800 mb-2">
				<div className="px-4 py-2 flex flex-row justify-around">
					<div>
						<div className="text-center font-bold text-4xl text-red-600">
							{stats[0].infoNumber}
						</div>
						<p className="text-center text-gray-500 text-sm">{stats[0].infoTitle}</p>
					</div>
					{
						stats[1] &&
						<div className="ml-10">
							<div className="text-center font-bold text-4xl text-red-600">{stats[1].infoNumber}</div>
							<p className="text-center text-gray-500 text-sm">{stats[1].infoTitle}</p>
						</div>
					}
				</div>
			</div>
		</>
	)
}

export default Card;
