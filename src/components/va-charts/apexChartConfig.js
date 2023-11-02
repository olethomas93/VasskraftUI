import { defineAsyncComponent } from 'vue'

export const defaultConfig = {
  chart: {
    type: 'area',
    stacked: false,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true,
    },
    toolbar: {
      autoSelected: 'zoom',
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 5,
  },
  title: {
    text: 'Vassføring',
    align: 'left',
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return val.toFixed(2)
      },
    },
    title: {
      text: 'mVs',
    },
  },
  xaxis: {
    type: 'datetime',
    labels: {
      formatter: function (val) {
        return new Date(val).toLocaleString()
      },
    },
  },
  tooltip: {
    shared: false,
    y: {
      formatter: function (val) {
        return val.toFixed(2)
      },
    },
  },
}

export const chartTypesMap = {
  line: defineAsyncComponent(() => import('./apex-chart-types/LineChart.vue')),
  bar: defineAsyncComponent(() => import('./apex-chart-types/BarChart.vue')),
  area: defineAsyncComponent(() => import('./apex-chart-types/AreaChart.vue')),
}
