import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/tooltip';
import { get, map } from 'lodash';

export const dailyChartConfig: any = (covid19Data: any) => {
  return {
    title: [
      {
        text: 'Probable and confirmed cases in New Zealand',
        left: 'center',
        top: -5,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
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
      data: [
        'Total cases',
        'Total confirmed cases',
        'Total recovered cases',
        'New confirmed cases',
        'New probable cases',
      ],
      bottom: 5,
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
        name: 'Total cases',
        type: 'line',
        data: map(covid19Data, (c) => c.totalConfirmed + c.totalProbable),
        smooth: true,
      },
      {
        name: 'Total confirmed cases',
        type: 'line',
        data: map(covid19Data, 'totalConfirmed'),
        smooth: true,
      },
      {
        name: 'Total recovered cases',
        type: 'line',
        data: map(covid19Data, 'totalRecovered'),
        smooth: true,
      },
      {
        name: 'New confirmed cases',
        type: 'bar',
        stack: 'New cases',
        data: map(covid19Data, 'newConfirmed'),
        yAxisIndex: 1,
      },
      {
        name: 'New probable cases',
        type: 'bar',
        stack: 'New cases',
        data: map(covid19Data, 'newProbable'),
        yAxisIndex: 1,
      },
    ],
  };
};

export const pieChartConfig: any = (agesGroup: any, ethnicityGroup: any) => {
  let femaleNumber = 0;
  Object.keys(agesGroup).forEach((key) => {
    const female = get(agesGroup[key], 'female', 0);
    femaleNumber += female;
  });

  let maleNumber = 0;
  Object.keys(agesGroup).forEach((key) => {
    const male = get(agesGroup[key], 'male', 0);
    maleNumber += male;
  });

  let unknownNumber = 0;
  Object.keys(agesGroup).forEach((key) => {
    const unknown = get(agesGroup[key], 'unknown', 0);
    unknownNumber += unknown;
  });

  const ethnicity: { name: string; value: number }[] = [];
  Object.keys(ethnicityGroup).forEach((key) => {
    ethnicity.push({
      name: key,
      value: ethnicityGroup[key],
    });
  });

  return {
    title: [
      {
        text: 'Age, Gender and Ethnicity Groups',
        left: 'center',
        top: 50,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
      },
    ],
    toolbox: {
      top: 50,
      right: '15%',
      feature: {
        dataView: { show: true, readOnly: false, title: 'Data view' },
        restore: { show: true, title: 'Restore' },
        saveAsImage: { show: true, title: 'Save as image' },
      },
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
        radius: [0, '40%'],
        center: ['32%', '55%'],
        label: {
          position: 'inner',
        },
        labelLine: {
          show: false,
        },
        data: [
          { name: 'Female', value: femaleNumber },
          { name: 'Male', value: maleNumber },
          { name: 'Unknown', value: unknownNumber },
        ],
      },
      {
        name: 'Age Groups',
        type: 'pie',
        radius: ['45%', '60%'],
        center: ['32%', '55%'],
        label: {
          formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
          backgroundColor: '#eee',
          borderColor: '#aaa',
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            a: {
              color: '#999',
              lineHeight: 22,
              align: 'center',
            },
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
        data: Object.keys(agesGroup).map((key) => {
          const female = get(agesGroup[key], 'female', 0);
          const male = get(agesGroup[key], 'male', 0);
          const unknown = get(agesGroup[key], 'unknown', 0);
          return {
            name: key,
            value: female + male + unknown,
          };
        }),
      },
      {
        name: 'Ethnicity Groups',
        type: 'pie',
        radius: '60%',
        center: ['75%', '55%'],
        data: ethnicity,
      },
    ],
  };
};

export const testsChartConfig: any = (covid19Data: any) => {
  return {
    title: [
      {
        text: 'Tests v.s Cases',
        left: 'center',
        top: -2,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
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
      data: ['Total cases', 'Total tests', 'Daily tests', 'Daily cases'],
      bottom: 5,
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
      {
        type: 'category',
        data: map(covid19Data, 'date'),
        gridIndex: 1,
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
        name: 'Total tests',
        position: 'left',
      },
      {
        type: 'value',
        name: 'Daily cases',
        position: 'right',
        gridIndex: 1,
      },
      {
        type: 'value',
        name: 'Daily tests',
        position: 'left',
        gridIndex: 1,
      },
    ],
    grid: [
      { left: '5%', width: '40%' },
      { left: '55%', width: '40%' },
    ],
    series: [
      {
        name: 'Total cases',
        type: 'line',
        data: map(covid19Data, (c) => c.totalConfirmed + c.totalProbable),
        smooth: true,
      },
      {
        name: 'Total tests',
        type: 'bar',
        stack: 'Tests',
        yAxisIndex: 1,
        data: map(covid19Data, 'totalTests'),
      },
      {
        name: 'Daily tests',
        type: 'bar',
        data: map(covid19Data, 'newTests'),
        xAxisIndex: 1,
        yAxisIndex: 3,
        gridIndex: 1,
      },
      {
        name: 'Daily cases',
        type: 'line',
        data: map(covid19Data, (c) => c.newConfirmed + c.newProbable),
        smooth: true,
        xAxisIndex: 1,
        yAxisIndex: 2,
        gridIndex: 1,
      },
    ],
  };
};
