import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { map } from 'lodash';

export const dailyChartConfig: any = (covid19Data: any) => {
  return {
    title: [
      {
        text: 'Probable and confirmed cases in New Zealand',
        left: 'center',
        top: -5,
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
      data: ['Total confirmed cases', 'Total recovery cases', 'New confirmed cases', 'New probable cases'],
      top: 20,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: '#666666',
          type: 'dashed',
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
        name: 'Total cases',
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
        name: 'Total recovery cases',
        type: 'line',
        data: map(covid19Data, 'totalRecovery'),
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

export const pieChartConfig: any = (covid19Data: any) => {
  let maleNumber = 0;
  Object.keys(covid19Data).forEach((key) => (maleNumber += covid19Data[key]['male']));

  let femaleNumber = 0;
  Object.keys(covid19Data).forEach((key) => (femaleNumber += covid19Data[key]['female']));

  return {
    title: [
      {
        text: 'Age and Gender Groups',
        left: 'center',
        top: -5,
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
      top: 30,
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)',
    },
    series: [
      {
        name: 'Gender Groups',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],
        label: {
          position: 'inner',
        },
        labelLine: {
          show: false,
        },
        data: [
          { name: 'Female', value: femaleNumber },
          { name: 'Male', value: maleNumber },
        ],
      },
      {
        name: 'Age Groups',
        type: 'pie',
        radius: ['40%', '55%'],
        label: {
          formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
          backgroundColor: '#eee',
          borderColor: '#aaa',
          borderWidth: 1,
          borderRadius: 4,
          // shadowBlur:3,
          // shadowOffsetX: 2,
          // shadowOffsetY: 2,
          // shadowColor: '#999',
          // padding: [0, 7],
          rich: {
            a: {
              color: '#999',
              lineHeight: 22,
              align: 'center',
            },
            // abg: {
            //     backgroundColor: '#333',
            //     width: '100%',
            //     align: 'right',
            //     height: 22,
            //     borderRadius: [4, 4, 0, 0]
            // },
            hr: {
              borderColor: '#aaa',
              width: '100%',
              borderWidth: 0.5,
              height: 0,
            },
            b: {
              fontSize: 16,
              lineHeight: 33,
            },
            per: {
              color: '#eee',
              backgroundColor: '#334455',
              padding: [2, 4],
              borderRadius: 2,
            },
          },
        },
        data: Object.keys(covid19Data).map((key) => {
          return {
            name: key,
            value: covid19Data[key]['female'] + covid19Data[key]['male'],
          };
        }),
      },
    ],
  };
};
