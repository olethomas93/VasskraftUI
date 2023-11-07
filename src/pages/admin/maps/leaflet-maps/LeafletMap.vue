<template>
  <div ref="mapRef" class="leaflet-map h-full" />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  import 'leaflet-map'
  import 'leaflet/dist/leaflet.css'
  import * as Leaflet from 'leaflet'

  Leaflet.Icon.Default.imagePath = '/vendor/leaflet/'

  const mapRef = ref()

  onMounted(() => {
    const map = Leaflet.map(mapRef.value).setView([60.648807831392475, 5.470285830811794], 13)

    Leaflet.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    Leaflet.marker([60.648807831392475, 5.470285830811794]).addTo(map).bindPopup('Sensor').openPopup()
  })
</script>
