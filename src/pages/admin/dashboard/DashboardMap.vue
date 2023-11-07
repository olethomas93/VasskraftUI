<template>
  <div class="grid grid-cols-12 gap-6">
    <va-card class="col-span-12 lg:col-span-12">
      <va-card-title> Kart </va-card-title>
      <leaflet-maps-page></leaflet-maps-page>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import LeafletMapsPage from '../maps/leaflet-maps/LeafletMapsPage.vue'

  import LineMap from '../../../components/maps/LineMap.vue'
  import { lineMapData, compareStrings } from '../../../data/maps/lineMapData'

  const { t } = useI18n()

  const cities = ref(lineMapData.cities)
  const mainCity = ref('Vilnius')
  const homeCity = ref('Vilnius')

  function addAddress(address: { city: string; country: string }) {
    cities.value = cities.value.map((mapItem) =>
      compareStrings(mapItem.title, address.city) && compareStrings(mapItem.country, address.country)
        ? { ...mapItem, color: 'success' }
        : mapItem,
    )
  }

  defineExpose({ addAddress })
</script>

<style>
  .dashboard-map {
    height: 380px;
  }
</style>
