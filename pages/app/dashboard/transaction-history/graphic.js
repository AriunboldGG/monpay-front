import React from 'react';
import ApexChart from 'components/charts/apex';
import Chart from 'components/charts/index';

const transactionGraphic = (props) => {
  return (
    <div className="mp-chart">
      <Chart dataTemp={props.graphDataTemp} tabData={props.tabData} />
      <ApexChart apexData={props.apexData} />
    </div>
  );
};
export default transactionGraphic;
