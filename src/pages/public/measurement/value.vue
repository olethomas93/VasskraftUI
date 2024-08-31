<template>
  <div>
    <div v-if="loading"><VaSkeleton /></div>
    <div v-if="error">{{ error }}</div>
    <div v-if="data">
      <!-- Render your data here -->
      <h1>{{ data.field }}</h1>
      <h2>{{ data.value }} {{ data.unit }}</h2>
      <h3>{{ data.time }}</h3>
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
            sensorId: Number(sensorId),
            field: field,
          })
          if (res) {
            let unit = res.data.unit
            for (var i in res.data.data) {
              let field = i.toUpperCase()
              let value = res.data.data[i][0]._value * res.data.factor
              value = value.toFixed(1)
              let time =
                new Date(res.data.data[i][0]._time).toDateString() +
                ' ' +
                new Date(res.data.data[i][0]._time).toLocaleTimeString()

              data.value = { field, value, time, unit }
            }
            console.log(data.value)
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
