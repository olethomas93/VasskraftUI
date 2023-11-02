<template>
  <VueApexCharts type="line" :options="chartOptions" :series="props.chartData"></VueApexCharts>
</template>

<script setup lang="ts">
  import VueApexCharts from 'vue3-apexcharts'

  const props = defineProps<{
    chartData: any
    chartOptions?: any
  }>()
</script>
