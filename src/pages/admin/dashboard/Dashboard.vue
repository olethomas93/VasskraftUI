<template>
  <div class="dashboard">
    <div>
      <h6>Time Picker</h6>
      <VaDatePicker v-model="range" mode="range" />
    </div>
    <dashboard-charts :data="data" />
    <dashboard-info-block :data="data"></dashboard-info-block>
    <dashboard-map></dashboard-map>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { useCollection, useFirestore } from 'vuefire'
  import {
    getDatabase,
    onValue,
    ref as storageRef,
    get,
    child,
    orderByChild,
    query,
    limitToLast,
    startAt,
    endAt,
  } from 'firebase/database'
  import { getFirestore, collection } from 'firebase/firestore'
  import DashboardCharts from './DashboardCharts.vue'
  import DashboardMap from './DashboardMap.vue'
  import DashboardInfoBlock from './DashboardInfoBlock.vue'
  import { firebaseApp } from '../../../main'
  import { once } from 'events'

  const data = ref()
  const dbRef = storageRef(getDatabase())
  get(child(dbRef, `data`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        //data.value = snapshot.val()
      } else {
        console.log('No data available')
      }
    })
    .catch((error) => {
      console.error(error)
    })

  const datePlusDay = (date, days) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
  }
  const lastweek = datePlusDay(new Date(), -7)

  const range = ref({ start: lastweek, end: new Date() })

  watch(range, async (newRange, oldRange) => {
    queryData(newRange.start, newRange.end)
  })

  const queryData = (start: Date, end: Date) => {
    const startTimestamp = start.getTime() / 1000
    const endTimestamp = end.getTime() / 1000

    const test = query(
      child(dbRef, 'data'),
      orderByChild('time'),
      startAt(Math.floor(startTimestamp)),
      endAt(Math.floor(endTimestamp)),
    )

    get(test).then((snapshot) => {
      data.value = snapshot.val()
    })
  }

  onMounted(() => {
    console.log(range.value)
    queryData(range.value.start, range.value.end)
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
