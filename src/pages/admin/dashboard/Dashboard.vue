<template>
  <div class="dashboard">
    <dashboard-charts :data="data" />
    <dashboard-info-block :data="data"></dashboard-info-block>
    <dashboard-map></dashboard-map>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { getDatabase, onValue, ref as storageRef, get, child } from 'firebase/database'
  import DashboardCharts from './DashboardCharts.vue'
  import DashboardMap from './DashboardMap.vue'
  import DashboardInfoBlock from './DashboardInfoBlock.vue'

  const data = ref()
  const dbRef = storageRef(getDatabase())
  get(child(dbRef, `data`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        data.value = snapshot.val()
      } else {
        console.log('No data available')
      }
    })
    .catch((error) => {
      console.error(error)
    })
</script>

<style lang="scss">
  .dashboard {
    .va-card {
      margin-bottom: 0 !important;
      &__title {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
