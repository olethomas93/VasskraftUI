<template>
  <div class="grid grid-cols-12 gap-6">
    <template v-for="mes in measurements" :key="mes.name">
      <va-card class="col-span-12 lg:col-span-6 card">
        <va-card-content>
          <apex-chart
            type="area"
            :options="{ ...{ title: { text: mes.name } }, ...config, ...trendConfig[mes.name] }"
            :data="[
              {
                name: mes.name,
                data: mes.data,
              },
            ]"
          ></apex-chart>
        </va-card-content>
      </va-card>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { doughnutChartData, lineChartData } from '../../../data/charts'
  import { useChartData } from '../../../data/charts/composables/useChartData'
  import { usePartOfChartData } from './composables/usePartOfChartData'
  import apexChart from '../../../components/va-charts/apexChart.vue'

  const { t } = useI18n()

  const props = defineProps<{
    data: any
    mes: any
    trendConfig: any
  }>()

  watch(
    () => props.data,
    () => {
      parseDate(props.data)
    },
  )

  const dataGenerated = useChartData(lineChartData, 0.7)
  const measurements = ref([])
  const config = ref()
  const {
    dataComputed: lineChartDataGenerated,
    minIndex,
    maxIndex,
    datasetIndex,
    setDatasetIndex,
  } = usePartOfChartData(dataGenerated)

  function parseDate(data: any) {
    var temp = []
    for (var i in data) {
      let temp2 = []
      if (props.mes.includes(i)) {
        let offset = 0
        let factor = 1
        if (props.trendConfig[i]) {
          offset = props.trendConfig[i].offset ? props.trendConfig[i].offset : 0
          factor = props.trendConfig[i].factor ? props.trendConfig[i].factor : 1
        }

        for (var value in data[i]) {
          // console.log(data[mes][value]._value)
          if (data[i][value]._value > 0) {
            let datapoint = (data[i][value]._value + offset) * factor

            temp2.push({ x: data[i][value]._time, y: datapoint.toFixed(2) })
          }
        }
        temp.push({ data: temp2, name: i })
      }
    }
    measurements.value = temp
    // console.log('TESTING',temp)
    // let retData: any[] = []
    // let voltData: any[] = []
    // for (let obj in data.voltage) {
    //   voltData.push({ x: data.voltage[obj]._time, y: data.voltage[obj]._value })
    // }
    // for (let obj in data.level) {
    //   retData.push({ x: data.level[obj]._time, y: data.level[obj]._value })
    // }
    // console.log(retData)
    // vasskraft.value = retData
    // voltage.value = voltData
    return temp
  }

  config.value = {
    chart: {
      type: 'area',
      zoom: {
        type: 'x',
        enabled: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
    },
    theme: {
      mode: 'light',
      palette: 'palette3',
      monochrome: {
        enabled: false,
        color: '#255aee',
        shadeTo: 'light',
        shadeIntensity: 0.65,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.7,
        opacityTo: 1,
        stops: [0, 50, 100],
        colorStops: [],
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(3)
        },
      },
    },
    annotations: {
      yaxis: [],
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
      theme: 'dark',
      y: {
        formatter: function (val) {
          return val.toFixed(2)
        },
      },
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: {
            height: 400,
            zoom: {
              type: 'x',
              enabled: true,
              autoScaleYaxis: true,
            },
          },
          plotOptions: {},
          legend: {
            position: 'bottom',
          },
          yaxis: {
            labels: {
              formatter: function (val) {
                return val.toFixed(3)
              },
            },
            title: {
              show: false,
            },
          },
        },
      },
    ],
  }
  const voltConfig = {
    chart: {
      type: 'area',
      stacked: false,
      zoom: {
        type: 'xy',
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
      size: 1,
    },
    title: {
      text: 'Batterispenning',
      align: 'left',
    },
    fill: {
      type: 'solid',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 1,
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
        text: 'V',
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
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: {
            height: 400,
            zoom: {
              type: 'x',
              enabled: true,
              autoScaleYaxis: true,
            },
          },
          plotOptions: {},
          legend: {
            position: 'bottom',
          },
          yaxis: {
            labels: {
              formatter: function (val) {
                return val.toFixed(2)
              },
            },
            title: {
              show: true,
            },
          },
        },
      },
    ],
  }
</script>

<style lang="scss">
  .card {
    transition: all 0.5s;
  }
  .card:hover {
    --va-card-box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.3);
  }
</style>
