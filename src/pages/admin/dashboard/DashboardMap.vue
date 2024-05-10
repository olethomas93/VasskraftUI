<template>
  <div class="grid grid-cols-12 gap-6">
    <va-card class="col-span-12 lg:col-span-12 gap-6">
      <va-card-title> Kart </va-card-title>
      <leaflet-maps-page :pos="myPropValue"></leaflet-maps-page>
      <!-- <map-libre-maps-page></map-libre-maps-page> -->
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import LeafletMapsPage from '../maps/leaflet-maps/LeafletMapsPage.vue'

  const props = defineProps(['pos'])
  const myPropValue = ref()
  watch(
    () => props.pos,
    (newValue, oldValue) => {
      // React to prop changes
      console.log('Prop changed:', newValue)
      myPropValue.value = newValue // Update the value in the ref if needed
    },
  )
</script>

<style>
  .dashboard-map {
    height: 380px;
  }
</style>
