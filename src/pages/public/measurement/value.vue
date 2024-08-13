<template>
  <div>
    <div v-if="loading"><VaSkeleton /></div>
    <div v-if="error">{{ error }}</div>
    <div v-if="data">
      <!-- Render your data here -->
      <p>{{ data }}</p>
    </div>
  </div>
</template>

<script>
  import { defineComponent, computed, onMounted, ref } from 'vue'
  import { useUserStore } from '../../../stores/user'
  import { useRoute } from 'vue-router'

  export default defineComponent({
    name: 'Value',
    setup() {
      const store = useUserStore()
      const route = useRoute()
      const data = ref(null)
      const loading = ref(true)
      const error = ref(null)
      const sensorId = computed(() => route.params.sensorId)
      const field = computed(() => route.params.field)

      const queryDataApi = async (sensorId, field) => {
        try {
          const res = await store.getLastValue({
            sensorId: sensorId,
            field: field,
          })
          if (res) {
            data.value = res.data
          }
        } catch (err) {
          error.value = 'failed'
        } finally {
          loading.value = false
        }
      }
      onMounted(queryDataApi(sensorId.value, field.value))
      return {
        field,
        sensorId,
        data,
      }
    },
  })
</script>

<style scoped></style>
