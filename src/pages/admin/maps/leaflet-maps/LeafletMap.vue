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
  watch(props.pos, async (newRange, oldRange) => {
    myPropValue.value = newRange
    initMap()
  })
  Leaflet.Icon.Default.imagePath = '/vendor/leaflet/'
  var norgeskart = Leaflet.tileLayer(
    'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
    {
      opacity: 1,
      maxZoom: 19,
      detectRetina: true,

      attribution: '&copy; <a href="https://www.kartverket.no/">Kartverket</a>',
    },
  )
  const mapRef = ref()
  const initMap = () => {
    const map = Leaflet.map(mapRef.value).setView([myPropValue.value.pos.lat, myPropValue.value.pos.lng], 13)

    Leaflet.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}', {
      opacity: 1,
      maxZoom: 19,
      detectRetina: true,

      attribution: '&copy; <a href="https://www.kartverket.no/">Kartverket</a>',
    }).addTo(map)

    Leaflet.marker([myPropValue.value.pos.lat, myPropValue.value.pos.lng]).addTo(map).bindPopup('Sensor').openPopup()
  }
  onMounted(() => {
    console.log(props.pos)
  })
</script>
