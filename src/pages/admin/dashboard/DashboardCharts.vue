<template>
  <div class="grid grid-cols-12 gap-6">
    <va-card class="col-span-12 lg:col-span-6">
      <va-card-content>
        <apex-chart
          type="area"
          :options="vassConfig"
          :data="[
            {
              name: 'Vassføring',
              data: vasskraft,
            },
          ]"
        ></apex-chart>
      </va-card-content>
    </va-card>

    <va-card class="col-span-12 lg:col-span-6">
      <va-card-content>
        <apex-chart
          type="area"
          :options="voltConfig"
          :data="[
            {
              name: 'Spenning',
              data: voltage,
            },
          ]"
        ></apex-chart>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { useFirestore } from 'vuefire'
  import { getDatabase, onValue, ref as storageRef, get, child } from 'firebase/database'
  import { useI18n } from 'vue-i18n'

  import { doughnutChartData, lineChartData } from '../../../data/charts'
  import { useChartData } from '../../../data/charts/composables/useChartData'
  import { usePartOfChartData } from './composables/usePartOfChartData'
  import VaChart from '../../../components/va-charts/VaChart.vue'
  import apexChart from '../../../components/va-charts/apexChart.vue'

  const { t } = useI18n()

  const props = defineProps<{
    data: any
  }>()
  const doughnutChart = ref()
  const dbRef = storageRef(getDatabase())
  // get(child(dbRef, `data`))
  //   .then((snapshot) => {
  //     if (snapshot.exists()) {
  //       parseDate(snapshot.val())
  //     } else {
  //       console.log('No data available')
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error)
  //   })

  watch(
    () => props.data,
    () => {
      parseDate(props.data)
    },
  )

  const dataGenerated = useChartData(lineChartData, 0.7)
  const doughnutChartDataGenerated = useChartData(doughnutChartData)
  const vasskraft = ref()
  const voltage = ref()
  const {
    dataComputed: lineChartDataGenerated,
    minIndex,
    maxIndex,
    datasetIndex,
    setDatasetIndex,
  } = usePartOfChartData(dataGenerated)

  function parseDate(data: any) {
    let retData: any[] = []
    let voltData: any[] = []
    for (let obj in data) {
      let temp = new Date(data[obj].time * 1000)
      temp.setHours(temp.getHours() - 4)
      retData.push({ x: temp.toUTCString(), y: data[obj].sensor })
      voltData.push({ x: temp.toUTCString(), y: data[obj].voltage })
    }
    vasskraft.value = retData
    voltage.value = voltData
    return retData
  }
  function printChart() {
    const windowObjectReference = window.open('', 'Print', 'height=600,width=800') as Window

    const img = windowObjectReference.document.createElement('img')

    img.src = `${(document.querySelector('.chart--donut canvas') as HTMLCanvasElement | undefined)?.toDataURL(
      'image/png',
    )}`

    img.onload = () => {
      windowObjectReference?.document.body.appendChild(img)
    }

    windowObjectReference.print()

    windowObjectReference.onafterprint = () => {
      windowObjectReference?.close()
    }
  }

  const vassConfig = {
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
    dataLabels: {
      enabled: false,
    },
    title: {
      text: 'Vassføring',
      align: 'left',
    },
    markers: {
      size: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.9,
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
      size: 3,
    },
    title: {
      text: 'Spenning',
      align: 'left',
    },
    fill: {
      type: 'gradient',
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
              show: false,
            },
          },
        },
      },
    ],
  }
</script>

<style scoped>
  /* .chart {
    height: 400px;
  } */
</style>
