import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

export default function RevenueChart() {
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e2e8f0',
      textStyle: { color: '#0f172a' },
      padding: [10, 15],
      axisPointer: {
        type: 'line',
        lineStyle: { color: '#cbd5e1', width: 2, type: 'dashed' }
      }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', margin: 15 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
      axisLabel: { color: '#64748b', formatter: '${value}k' }
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        smooth: 0.4,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: false,
        itemStyle: { color: '#4f46e5' },
        lineStyle: { width: 3, color: '#4f46e5' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(79, 70, 229, 0.2)' },
            { offset: 1, color: 'rgba(79, 70, 229, 0)' }
          ])
        },
        data: [12, 19, 15, 25, 22, 32, 28]
      }
    ]
  };

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '100%', width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}