<template>
  <div class="grid grid-cols-12 gap-6">
    <va-card class="col-span-12 lg:col-span-12 gap-6">
      <va-card-title> Kart </va-card-title>
      <leaflet-maps-page></leaflet-maps-page>
      <!-- <map-libre-maps-page></map-libre-maps-page> -->
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import LeafletMapsPage from '../maps/leaflet-maps/LeafletMapsPage.vue'
  import { useUserStore } from '../../../stores/user'

  import { lineMapData, compareStrings } from '../../../data/maps/lineMapData'
  import MapLibreMapsPage from '../maps/maplibre-maps/MapLibreMapsPage.vue'
</script>

<style>
  .dashboard-map {
    height: 380px;
  }
</style>
