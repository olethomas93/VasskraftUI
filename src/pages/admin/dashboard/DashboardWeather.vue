<template>
  <div class="pt-6 grid grid-cols-12 gap-6">
    <va-card class="col-span-12 lg:col-span-12 card gap-6">
      <va-card-content>
        <VueApexCharts
          ref="chartRef"
          class="va-chart"
          type="bar"
          height="300"
          :options="chartOptions"
          :series="series"
        ></VueApexCharts>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import VueApexCharts from 'vue3-apexcharts'
  import { useColors } from 'vuestic-ui'

  const props = defineProps<{
    placeNumber: any
  }>()
  const lastValues = ref()
  watch(
    () => props.placeNumber,
    () => {
      fetchWeather(props.placeNumber)
    },
  )
  const chartRef = ref(null)

  const series = ref([])
  const chartOptions = ref()
  chartOptions.value = {
    chart: {
      type: 'bar',
      height: 200,
      width: '100%',
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: false,
      },
    },
    responsive: [{}],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadiusApplication: 'end', // 'around', 'end'
        borderRadiusWhenStacked: 'last', // 'all', 'last'
        columnWidth: '50%',
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    xaxis: {
      type: 'datetime',
      position: 'top',
    },
    yaxis: {
      max: 100,
      labels: {
        show: false,
        formatter: function (val) {
          return val + '%'
        },
      },
    },
    legend: {
      position: 'bottom',
    },
    fill: {
      opacity: 0.8,
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + '%'
      },
    },
    colors: ['#004952', '#00b3c7'],
  }
  function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }
  function parseData(data: any) {
    // Check if data and sevenDayIntervals exist
    if (!data || !data.sevenDayIntervals) {
      console.log('Invalid data')
      return
    }

    let series1 = { name: 'Sannsynlighet for litt nedbør (0,5–10 mm)', data: [] }
    let series2 = { name: 'Sannsynlighet for mye nedbør (mer enn 10 mm)', data: [] }
    let series3 = []
    data.sevenDayIntervals.forEach((interval) => {
      const startDate = new Date(interval.start).toDateString()
      const endDate = new Date(interval.end).toDateString()

      console.log(`Forecast from ${startDate} to ${endDate}:`)

      // Iterate through the day intervals
      interval.dayIntervals.forEach((day) => {
        const dayDate = new Date(day.time)
        series3.push(formatDate(dayDate))
        const maxTemp = day.airTemperatureMax
        const minTemp = day.airTemperatureMin
        const precipProbability = day.probabilityOfPrecipitation

        const heavyPrecipProbability = day.probabilityOfHeavyPrecipitation
        series2.data.push(heavyPrecipProbability)

        let temp = precipProbability - heavyPrecipProbability

        series1.data.push(temp)
        const frostProbability = day.probabilityOfFrost
        const precipitationAmount = day.precipitationAmount50Percentile
      })

      // Summary information for the entire interval
      if (interval.summary) {
        const maxTempSummary = interval.summary.airTemperatureMax
        const minTempSummary = interval.summary.airTemperatureMin
        const precipitationTotal = interval.summary.precipitationAmount
      }

      series.value = [series2, series1]
      chartOptions.value.xaxis.categories = series3
      console.log(
        chartRef.value.updateOptions({
          xaxis: {
            categories: series3,
          },
        }),
      )
    })
  }

  async function fetchWeather(placeNumber) {
    let res = await axios.get(`https://www.api.northei.no/v1/weather/subSeasonalForecast?placeNumber=${placeNumber}`)

    console.log(res)
    parseData(res.data.data)
    return res.data.data
  }

  const { t } = useI18n()
  const { currentPresetName } = useColors()

  watch(currentPresetName, async (newCurrentPresetName, oldCurrentPresetName) => {
    console.log('changing from dashboard:', newCurrentPresetName)
  })

  const modal = ref(false)

  function showModal() {
    modal.value = true
  }
</script>

<style lang="scss" scoped>
  .va-chart {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    > * {
      height: 100%;
      width: 100%;
    }
  }
  .row-separated {
    .flex + .flex {
      border-left: 1px solid var(--va-background-primary);
    }
  }

  .rich-theme-card-text {
    line-height: 1.5;
  }

  .gallery-carousel {
    width: 80vw;
    max-width: 100%;

    @media all and (max-width: 576px) {
      width: 100%;
    }
  }
</style>
