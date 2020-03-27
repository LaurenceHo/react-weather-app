import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { map } from 'lodash';

export const chartConfig: any = (covid19Data: any) => {
  return {
    title: [
      {
        text: 'Probable and confirmed cases in New Zealand',
        left: 'center',
        top: -5,
      },
      {
        text: 'Age group',
        left: 'center',
        top: '50%',
      },
    ],
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false, title: 'Data view' },
        restore: { show: true, title: 'Restore' },
        saveAsImage: { show: true, title: 'Save as image' },
      },
    },
    grid: { bottom: '55%' },
    legend: {
      data: ['Total confirmed cases', 'New confirmed cases', 'New probable cases'],
      top: 20,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    xAxis: [
      {
        type: 'category',
        data: map(covid19Data.daily, 'date'),
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Total confirmed cases',
        position: 'right',
      },
      {
        type: 'value',
        name: 'New cases',
        position: 'left',
      },
    ],
    series: [
      {
        name: 'Total confirmed cases',
        type: 'line',
        data: map(covid19Data.daily, 'totalConfirmedCase'),
        smooth: true,
      },
      {
        name: 'Total recovery cases',
        type: 'line',
        data: map(covid19Data.daily, 'totalRecovery'),
        smooth: true,
      },
      {
        name: 'New confirmed cases',
        type: 'bar',
        stack: 'New cases',
        data: map(covid19Data.daily, 'newConfirmedCase'),
        yAxisIndex: 1,
      },
      {
        name: 'New probable cases',
        type: 'bar',
        stack: 'New cases',
        data: map(covid19Data.daily, 'newProbableCase'),
        yAxisIndex: 1,
      },
      {
        type: 'pie',
        radius: '30%',
        center: ['50%', '75%'],
        data: Object.keys(covid19Data['ages']).map((key) => {
          return {
            name: key,
            value: covid19Data['ages'][key]['female'] + covid19Data['ages'][key]['male'],
          };
        }),
      },
    ],
  };
};
