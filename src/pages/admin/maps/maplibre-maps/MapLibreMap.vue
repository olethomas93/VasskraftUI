<template>
  <div ref="mapRef" class="maplibre-map h-full" />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import maplibregl from 'maplibre-gl'
  import 'maplibre-gl/dist/maplibre-gl.css'

  const mapRef = ref()
  const style = {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}'],
        tileSize: 256,
        attribution: '&copy; Norgeskart',
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm', // This must match the source key above
      },
    ],
  }

  onMounted(() => {
    const map = new maplibregl.Map({
      container: mapRef.value,
      style: style,
      center: [5.470285830811794, 60.648807831392475],
      zoom: 12,
    })

    const marker = new maplibregl.Marker().setLngLat([5.470285830811794, 60.648807831392475]).addTo(map)

    map.addControl(new maplibregl.NavigationControl({}))
  })
</script>
