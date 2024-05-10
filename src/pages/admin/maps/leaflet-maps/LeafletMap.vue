<template>
  <div ref="mapRef" class="leaflet-map h-full" />
</template>

<script setup lang="ts">
  const props = defineProps<{
    pos: any
  }>()
  import { ref, onMounted, watch } from 'vue'

  import 'leaflet-map'
  import 'leaflet/dist/leaflet.css'
  import * as Leaflet from 'leaflet'
  const myPropValue = ref(props.pos)
  const map = ref()
  const marker = ref()

  watch(
    () => props.pos,
    (newValue, oldValue) => {
      // React to prop changes
      console.log('Prop changed maps page:', newValue)
      myPropValue.value = newValue // Update the value in the ref if needed

      map.value.setView([newValue.lat, newValue.lng], 13)
      if (marker.value) {
        map.value.removeLayer(marker.value)
        marker.value = null
        marker.value = Leaflet.marker([myPropValue.value.lat, myPropValue.value.lng])
          .addTo(map.value)
          .bindPopup('Sensor')
          .openPopup()
      } else {
        console.log('')
        marker.value = Leaflet.marker([myPropValue.value.lat, myPropValue.value.lng])
          .addTo(map.value)
          .bindPopup('Sensor')
          .openPopup()
      }
    },
  )
  Leaflet.Icon.Default.imagePath = '/vendor/leaflet/'

  const mapRef = ref()

  const initMap = () => {
    var norgeskart = Leaflet.tileLayer(
      'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
      {
        opacity: 1,
        maxZoom: 19,
        detectRetina: true,

        attribution: '&copy; <a href="https://www.kartverket.no/">Kartverket</a>',
      },
    )

    map.value = Leaflet.map(mapRef.value, {
      layers: [norgeskart],
    })

    map.value.addLayer(norgeskart)
    map.value.setView([69, 18], 13)
    //
  }
  onMounted(() => {
    initMap()
  })
</script>
