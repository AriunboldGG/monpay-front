import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';

const Chart = (props) => {
  const { t } = useTranslation('dashboard');
  const [graphicProducts, setGraphicProducts] = useState([]);
  let dayjs = require('dayjs');
  var relativeTime = require('dayjs/plugin/relativeTime');
  dayjs.extend(relativeTime);

  useEffect(() => {
    if (props.dataTemp) {
    } else {
      async function fetchData() {
        const params = {
          limit: 50,
          beginDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
          endDate: dayjs().format('YYYY-MM-DD'),
        };

        axios.get(`/api/sales/total`, { params: params }).then(
          (resp) => {
            setGraphicProducts(resp.data.result);
          },
          (error) => {}
        );
      }
      fetchData();
    }
  }, []);
  const graphDataTemp = [];
  if (graphicProducts) {
    graphicProducts.map((d) => {
      const graphSingle = {
        name: '',
        Орлого: 0,
        Зарлага: 0,
      };
      graphSingle.name = d.dateUI;
      if (d.amount >= 0) {
        graphSingle['Орлого'] = d.amount;
      } else {
        graphSingle['Зарлага'] = d.amount * -1;
      }
      graphDataTemp.push(graphSingle);
    });
  }
  const grapDataIncome = props?.dataTemp?.filter((e) => e.Орлого !== 0);
  const grapDataExped = props?.dataTemp?.filter((e) => e.Зарлага !== 0);

  return (
    <div className="chart">
      <div className="chart-title">
        <h3>{t('changes-exp')}</h3>
        <div className="content-inner">
          <div>
            <span className="chart-with-depo">{t('income')}</span>
          </div>
          <div>
            <span className="chart-with-depo">{t('exp')}</span>
          </div>
        </div>
      </div>
      <div className="chart-inner">
        <ResponsiveContainer width="100%" height="100%" aspect={3}>
          <BarChart
            width={100}
            height={100}
            data={
              props.dataTemp
                ? props.tabData === 0
                  ? props.dataTemp
                  : props.tabData === 1
                  ? grapDataIncome
                  : grapDataExped
                : graphDataTemp
            }
          >
            <XAxis dataKey="name" reversed />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Зарлага" barSize={12} fill="#4341CC" />
            <Bar dataKey="Орлого" barSize={12} fill="#11D8E2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
