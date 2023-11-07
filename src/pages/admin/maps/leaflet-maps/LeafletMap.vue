<template>
  <div ref="mapRef" class="leaflet-map h-full" />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  import 'leaflet-map'
  import 'leaflet/dist/leaflet.css'
  import * as Leaflet from 'leaflet'

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

  onMounted(() => {
    const map = Leaflet.map(mapRef.value).setView([60.648807831392475, 5.470285830811794], 13)

    Leaflet.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}', {
      opacity: 1,
      maxZoom: 19,
      detectRetina: true,

      attribution: '&copy; <a href="https://www.kartverket.no/">Kartverket</a>',
    }).addTo(map)

    Leaflet.marker([60.648807831392475, 5.470285830811794]).addTo(map).bindPopup('Sensor').openPopup()
  })
</script>
