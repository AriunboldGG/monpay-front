import dynamic from 'next/dynamic';
import { useState } from 'react';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ApexChart = (props) => {
    const { test, setTest } = useState([]);

    function groupBy(objectArray, property) {
        let gg = [];
        return objectArray?.reduce(function (acc, obj) {
            let key = obj[property];
            if (!acc[key]) {
                gg.push(key);
            }
            return gg;
        }, {});
    }

    let groupedPeople = groupBy(props.apexData, 'destinationName');
    function totalSum(objectArray, property) {
        return objectArray?.reduce(function (acc, obj) {
            let key = obj[property];
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});
    }

    function squash(arr) {
        var tmp = [];
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                if (tmp.indexOf(arr[i]) == -1) {
                    tmp.push(arr[i]);
                }
            }
        }
        return tmp;
    }

    function gg() {
        let test = totalSum(props.apexData, 'destinationName');
        let pp = [];
        squash(groupedPeople).map((x, i) => {
            let bb = 0;
            test[x].map((g) => {
                bb = bb + g.amount;
            });
            pp.push(Math.abs(bb));
        });
        return pp;
    }
    const options = {
        stroke: {
            width: 0,
        },
        labels: squash(groupedPeople),
        colors: [
            '#3678F8',
            '#11D8E2',
            '#4341CC',
            '#F72585',
            '#B5179E',
            '#560BAD',
        ],
        offset: 0,
        size: '100px',
        grid: {
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        },
        responsive: [
            {
                breakpoint: undefined,
                options: {},
            },
        ],
        chart: {
            offsetX: 0,
            offsetY: 0,
        },
        plotOptions: {
            area: {
                fillTo: 0,
            },
            pie: {
                startAngle: 0,
                endAngle: 360,
                expandOnClick: true,
                offset: 0,
                offsetX: 0,
                offsetY: 0,
                customScale: 1,
                dataLabels: {
                    offset: 0,
                    minAngleToShowLabel: -100,
                },
                expandOnclick: false,
                donut: {
                    size: '60px',
                    labels: {
                        offset: 0,
                        show: true,
                        name: {
                            show: true,
                            fontSize: '11px',
                            fontFamily: 'Code Next',
                            fontWeight: 600,
                            color: '#5B698E',
                            offsetY: -8,
                            formatter: function (val) {
                                return val;
                            },
                        },
                        value: {
                            show: true,
                            fontSize: '19px',
                            fontFamily: 'Code Next',
                            fontWeight: '600px',
                            color: '#161E34',
                            offsetY: 2,
                            formatter: function (val) {
                                return val;
                            },
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            fontSize: '11px',
                            color: '#5B698E',
                            label: 'Нийт дүн',
                            fontFamily: 'Code Next',
                            fontWeight: '600px',
                            offsetY: 1,
                            formatter: function (w) {
                                return w.globals.seriesTotals?.reduce(
                                    (a, b) => {
                                        return a + b;
                                    },
                                    0
                                );
                            },
                        },
                    },
                },
            },
        },
    };
    const series = gg();

    return (
        <div className="tw-chart-transaction">
            <div>
                <Chart
                    options={options}
                    series={series}
                    type="donut"
                    width="100%"
                    height={318}
                />
            </div>
        </div>
    );
};
export default ApexChart;
