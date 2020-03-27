import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
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
        bottom: 10,
      },
    ],
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false, title: 'Data view' },
        restore: { show: true, title: 'Restore' },
        saveAsImage: { show: true, title: 'Save as image' },
      },
    },
    legend: {
      data: ['Total confirmed cases', 'New confirmed cases', 'New probable cases'],
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
        data: map(covid19Data, 'date'),
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
        data: map(covid19Data, 'totalConfirmedCase'),
        smooth: true,
      },
      {
        name: 'New confirmed cases',
        type: 'bar',
        stack: 'New cases',
        data: map(covid19Data, 'newConfirmedCase'),
        yAxisIndex: 1,
      },
      {
        name: 'New probable cases',
        type: 'bar',
        stack: 'New cases',
        data: map(covid19Data, 'newProbableCase'),
        yAxisIndex: 1,
      },
    ],
  };
};
