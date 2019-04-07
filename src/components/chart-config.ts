import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';

import { map } from 'lodash';
import { Utils } from '../utils';
import { Timezone } from './data-model';

export const chartConfig: any = (units: string, timezone: Timezone, hourly: any) => {
  const formatterXAxisLabel = (value: number, index: number) => {
    if (index === 0) {
      return 'Now';
    }
    return Utils.getLocalTime(value, timezone.offset, 'HH:mm');
  };

  const formatterTooltip = (params: any) => {
    const temperature = params[0];
    const rain = params[1];
    const time = Utils.getLocalTime(temperature.name, timezone.offset, 'YYYY-MM-DD HH:mm');

    return `
      <div style="font-size:0.9rem; color:#949494; line-height:1.1rem;">${time}</div>
      </br>
      <div style="color:#2E2E2E; font-size:0.8rem; font-weight:500; line-height: 0.3rem;">
        Temperature:${Utils.getTemperature(temperature.value, units)}
      </div>
      </br>
      <div style="color:#2E2E2E; font-size:0.8rem; font-weight:500; line-height: 0.3rem;">
        Rain: ${rain.value} ${units === 'us' ? 'in' : 'mm'}
      </div>
     `;
  };

  const roundTemperature = map(hourly.data, n => {
    return Math.round(n.temperature);
  }).slice(0, 23);
  const roundIntensity = map(hourly.data, n => {
    if (units === 'us') {
      return n.precipIntensity.toFixed(3);
    } else if (units === 'si') {
      return n.precipIntensity.toFixed(2);
    }
  }).slice(0, 23);
  const temperatureMax = Math.round(Math.max.apply(null, roundTemperature) * 1.3);
  const rainMax = (Math.max.apply(null, roundIntensity) * 1.3).toFixed(1);

  return {
    legend: {
      data: ['Temperature', 'Rain'],
      right: '10%',
    },
    xAxis: {
      type: 'category',
      data: map(hourly.data, 'time').slice(0, 23),
      axisLabel: {
        formatter: formatterXAxisLabel,
      },
    },
    yAxis: [
      {
        type: 'value',
        max: temperatureMax,
        axisLabel: {
          formatter: units === 'us' ? '{value} ℉' : '{value} ℃',
        },
        splitLine: {
          show: false,
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255,255,255,0.3)', 'rgba(200,200,200,0.1)'],
          },
        },
      },
      {
        type: 'value',
        min: 0,
        max: rainMax,
        axisLabel: {
          formatter: units === 'us' ? '{value} in' : '{value} mm',
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#ccc',
      padding: [8, 17],
      extraCssText: 'box-shadow: 0 2px 4px 0 #CDCDCD;',
      formatter: formatterTooltip,
      axisPointer: {
        lineStyle: {
          color: '#666666',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: 'Temperature',
        data: roundTemperature,
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#1869b7',
          width: 2,
        },
        itemStyle: {
          color: '#1869b7',
        },
      },
      {
        name: 'Rain',
        type: 'bar',
        data: roundIntensity,
        yAxisIndex: 1,
        itemStyle: {
          color: '#A4A4A4',
        },
      },
    ],
  };
};
