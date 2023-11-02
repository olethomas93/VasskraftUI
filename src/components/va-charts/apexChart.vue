<template>
  <component :is="chartComponent" ref="chart" :chart-options="chartOptions" :chart-data="data" />
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { defaultConfig, chartTypesMap } from './apexChartConfig'

  const props = defineProps<{
    data: any
    options?: any
    type: keyof typeof chartTypesMap
  }>()

  const chart = ref()

  const chartComponent = computed(() => chartTypesMap[props.type])

  const chartOptions = computed(() => ({
    ...defaultConfig,
    ...props.options,
  }))
  onMounted(() => {
    chart.value // <div>
  })
</script>

<style lang="scss">
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
</style>
