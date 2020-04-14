import React from 'react'
import Card from '../Card'

export const Divider = () => (
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-gray-800 mb-2">
        <div className="px-2 py-2" />
    </div>
);

// https://particles.matteobruni.it/images/sars-cov-2.png

export default function LeftPanel() {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Drop Rate',
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
            <section className="w-1/4 h-full bg-gray-900 z-10 absolute left-0 top-0 text-white overflow-y-scroll">
                <div className="country-bg relative">
                    <img className="w-full opacity-50" src="https://raw.githubusercontent.com/NovelCOVID/API/master/assets/flags/ng.png" alt="Montenegro" />
                    <div className="absolute bottom-0 ml-5">
                        <h1 className="text-4xl text-white">Total Cases: 1000000</h1>
                    </div>
                </div>
                <div className="mt-10 px-2">
                    <Card stats={[
                        { infoTitle: 'Cases Today', infoNumber: '+254' },
                        { infoTitle: 'Deaths Today', infoNumber: '6' }
                    ]} />
                    <Divider />
                    <Card type="graph" graphData={data} />
                    <Divider />
                    <Card stats={[
                        { infoTitle: 'Recovered', infoNumber: 44 },
                        { infoTitle: 'Active', infoNumber: 204 }
                    ]} />
                    <Divider />
                    <Card stats={[
                        { infoTitle: 'Critical', infoNumber: 2 },
                        { infoTitle: 'Active', infoNumber: 204 }
                    ]} />
                </div>
            </section>
        </>
    )
}
