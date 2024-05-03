<template>
  <div class="leaflet-maps-page">
    <va-card class="leaflet-maps-page__widget" title="Leaflet Maps">
      <leaflet-map :pos="position" style="height: 65vh" />
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useUserStore } from '../../../../stores/user'
  import LeafletMap from './LeafletMap.vue'

  const store = useUserStore()
  const position = ref({ lat: 69, lng: 18 })
  onMounted(async () => {
    const customers = await store.getCustomer()
    position.value = JSON.parse(customers.meta).position
    console.log(position)
  })
</script>
