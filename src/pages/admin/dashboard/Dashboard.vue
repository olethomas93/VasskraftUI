<template>
  <div class="dashboard">
    <VaTabs v-model="value" grow>
      <template #tabs>
        <VaTab v-for="tab in tabs" :key="tab">
          {{ tab.sensorId }}
        </VaTab>
      </template>
      <div>
        <div>
          <h6>Time Picker</h6>
          <VaDatePicker v-model="range" mode="range" />
        </div>
        <dashboard-charts :data="data" />
        <dashboard-info-block :data="data"></dashboard-info-block>
        <dashboard-map></dashboard-map>
      </div>
    </VaTabs>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { useUserStore } from '../../../stores/user'
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
  import DashboardCharts from './DashboardCharts.vue'
  import DashboardMap from './DashboardMap.vue'
  import DashboardInfoBlock from './DashboardInfoBlock.vue'
  import { useRoute } from 'vue-router'
  import { start } from 'repl'
  const store = useUserStore()
  const data = ref()
  const dbRef = storageRef(getDatabase())
  const items = ref([])
  const value = ref(0)
  const position = ref()
  const customer = ref()
  const tabs = ref()
  const route = useRoute()
  const getCustomer = async () => {
    const customers = await store.getCustomer()
    customer.value = customers
    position.value = JSON.parse(customers.meta).position
    console.log(position.value)
    items.value = customers.sensors

    tabs.value = items.value
  }

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

  watch(value, async (newRange, oldRange) => {
    queryDataApi(range.value.start, range.value.end)
  })

  const queryData = (start: Date, end: Date) => {
    if (start && end) {
      queryDataApi(start, end)
    }
  }
  const queryDataApi = async (start: Date, end: Date) => {
    const sensor = items.value[value.value]
    console.log(start, end)
    const res = await store.getSensorHistory({ sensorId: sensor.sensorId, startDate: start, endDate: end })
    if (res) {
      data.value = res.data
    }
  }
  const queryDataFireBase = (start: Date, end: Date) => {
    const startTimestamp = start.getTime() / 1000
    const ole = end
    ole.setHours(23)
    const endTimestamp = ole.getTime() / 1000

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

  onMounted(async () => {
    await getCustomer()
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
