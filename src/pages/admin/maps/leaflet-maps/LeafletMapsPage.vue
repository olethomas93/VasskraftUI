<template>
  <div class="leaflet-maps-page">
    <va-card class="leaflet-maps-page__widget" title="Leaflet Maps">
      <leaflet-map :pos="myPropValue" style="height: 65vh" />
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import LeafletMap from './LeafletMap.vue'
  const props = defineProps<{
    pos: any
  }>()
  const myPropValue = ref()
  const position = ref()
  watch(
    () => props.pos,
    (newValue, oldValue) => {
      // React to prop changes
      console.log('Prop changed maps page:', newValue)
      myPropValue.value = newValue // Update the value in the ref if needed
    },
  )
</script>
