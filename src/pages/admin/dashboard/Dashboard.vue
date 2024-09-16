<template>
  <div class="dashboard">
    <VaTabs v-model="value" center hide-slider @update:model-value="update">
      <template #tabs>
        <VaTab v-for="tab in tabs" :key="tab">
          <VaButton :disabled="items[value].sensorId !== tab.sensorId" :round="false" preset="primary">{{
            JSON.parse(tab.meta).name
          }}</VaButton>
        </VaTab>
      </template>
      <div class="datePick">
        <VaDateInput v-model="range" :readonly="false" :format-date="formatDate" :parse-date="parseDate" />
        <VaSelect v-model="aggregate" :options="options" placeholder="Aggregate function" />
        <VaSelect v-model="window" :options="optionsWindow" placeholder="Time Window" />
      </div>
      <div class="tab">
        <dashboard-charts :data="data" :mes="measurements" :trend-config="trendConfig" />
        <dashboard-info-block
          :data="data"
          :place-number="placeNumber"
          :mes="measurements"
          :trend-config="trendConfig"
        ></dashboard-info-block>
        <DashboardWeather :place-number="placeNumber"></DashboardWeather>
        <dashboard-map :pos="position"></dashboard-map>
      </div>
    </VaTabs>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { useUserStore } from '../../../stores/user'
  import { getDatabase, ref as storageRef, get, child, orderByChild, query, startAt, endAt } from 'firebase/database'
  import DashboardCharts from './DashboardCharts.vue'
  import DashboardMap from './DashboardMap.vue'
  import DashboardInfoBlock from './DashboardInfoBlock.vue'
  import { useRoute } from 'vue-router'
  import DashboardWeather from './DashboardWeather.vue'
  const store = useUserStore()
  const data = ref()
  const dbRef = storageRef(getDatabase())
  const items = ref([])
  const value = ref(0)
  const customer = ref()
  const position = ref({ lat: 60, lng: 18 })
  const placeNumber = ref()
  const measurements = ref()
  const trendConfig = ref({})
  const tabs = ref()
  const options = ref(['median', 'mean', 'last'])
  const optionsWindow = ref(['1m', '1h', '6h', '12h'])
  const aggregate = ref('median')
  const window = ref('6h')
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }

  const parseDate = (text) => {
    const [day, month, year] = text.split('/')

    return new Date(year, month - 1, day)
  }
  const getCustomer = async () => {
    const customers = await store.getCustomer()
    customer.value = customers
    //position.value = JSON.parse(customers.meta).position
    items.value = customers.sensors
    let meta = JSON.parse(items.value[value.value].meta)

    position.value = meta.position
    measurements.value = meta.mes
    if (meta.trendConfig) {
      trendConfig.value = meta.trendConfig
    }

    await getPlace()
    tabs.value = items.value
    console.log('tabs', tabs.value)
  }
  //   position.value = computed(() => {
  //     if(items.value[value.value]){
  //       console.log( JSON.parse(items.value[value.value].meta).position)
  //       return JSON.parse(items.value[value.value].meta).position
  //     }else{
  //       return {lat:60,lng:18}
  //     }

  // })
  const update = async () => {
    position.value = JSON.parse(items.value[value.value].meta).position
    trendConfig.value = JSON.parse(items.value[value.value].meta).trendConfig
    measurements.value = JSON.parse(items.value[value.value].meta).mes
    console.log(trendConfig.value)
    await getPlace()
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
  watch(aggregate, async (newRange, oldRange) => {
    queryDataApi(range.value.start, range.value.end)
  })
  watch(window, async (newRange, oldRange) => {
    queryDataApi(range.value.start, range.value.end)
  })
  const queryData = (start: Date, end: Date) => {
    if (start && end) {
      queryDataApi(start, end)
    }
  }
  const getPlace = async () => {
    try {
      // https://ws.geonorge.no/stedsnavn/v1/punkt?nord=${this.position.latitude}&ost=${this.position.longitude}&koordsys=4258&radius=500&utkoordsys=4258&treffPerSide=10&side=1
      let res = await (
        await fetch(`https://www.windy.northei.no/place?lat=${position.value.lat}&lng=${position.value.lng}`)
      ).json()
      placeNumber.value = res._embedded.location[0].id
      console.log(placeNumber.value)
    } catch (e) {
      console.log(e)
    }
  }

  const queryDataApi = async (start: Date, end: Date) => {
    const sensor = items.value[value.value]
    const res = await store.getSensorHistory({
      sensorId: sensor.sensorId,
      startDate: start,
      endDate: end,
      aggregate: aggregate.value,
      period: window.value,
    })
    if (res) {
      console.log(res.data)
      data.value = res.data
    }
  }
  // const queryDataFireBase = (start: Date, end: Date) => {
  //   const startTimestamp = start.getTime() / 1000
  //   const ole = end
  //   ole.setHours(23)
  //   const endTimestamp = ole.getTime() / 1000

  //   const test = query(
  //     child(dbRef, 'data'),
  //     orderByChild('time'),
  //     startAt(Math.floor(startTimestamp)),
  //     endAt(Math.floor(endTimestamp)),
  //   )

  //   get(test).then((snapshot) => {
  //     data.value = snapshot.val()
  //   })
  // }

  onMounted(async () => {
    value.value = 0
    await getCustomer()
    queryData(range.value.start, range.value.end)
  })
</script>

<style lang="scss">
  .dashboard {
    min-width: 80%;
    .va-card {
      &__title {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .datePick {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
    width: fit-content;
  }
  .tab {
    min-width: 80vw;
  }
</style>
