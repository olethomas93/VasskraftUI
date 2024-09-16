<template>
  <div class="pt-6 grid grid-cols-12 gap-12">
    <div class="col-span-12 lg:col-span-12 flex flex-wrap">
      <div class="w-full pb-6 grid grid-cols-12 gap-6">
        <template v-for="item in lastValues" :key="item.name">
          <va-card class="col-span-12 sm:col-span-4 mb-4 card">
            <VaCardTitle>{{ item.name }}</VaCardTitle>
            <va-card-content>
              <h3 class="va-h2 m-0">{{ item.value.toFixed(2) }} {{ item.unit }}</h3>
            </va-card-content>
            <VaCardActions>
              {{ new Date(item.time).toDateString() + '  ' + new Date(item.time).toLocaleTimeString() }}
            </VaCardActions>
          </va-card>
        </template>
        <!-- <va-card class="col-span-12 sm:col-span-4 mb-8">
          <va-card-content>
            <p>Siste dybde</p>
            <h2 v-if="lastValues" class="va-h2 m-0">{{ lastValues.level.toFixed(2) }} m</h2>
            
          </va-card-content>
        </va-card>
        <va-card class="col-span-12 sm:col-span-4 mb-4">
          <va-card-content>
            <p>Siste spenning</p>
            <h2 v-if="lastValues" class="va-h2 m-0">{{ lastValues.voltage.toFixed(2) }}</h2>
            
          </va-card-content>
        </va-card> -->
        <!-- <va-card class="col-span-12 sm:col-span-4 mb-8">
          <va-card-content>
            <h2 v-if="lastValues" class="va-h2 m-0">{{ lastValues.time }}</h2>
            <p>Siste timestamp</p>
          </va-card-content>
        </va-card> -->
      </div>

      <div class="w-full grid grid-cols-1 gap-6">
        <va-card stripe stripe-color="info" class="col-span-12 sm:col-span-12 mb-12 card">
          <va-card-content>
            <div style="display: flex">
              <iframe
                style="min-height: 366px"
                width="100%"
                height="100vh"
                :src="`https://www.yr.no/nb/innhold/${placeNumber}/meteogram.svg?mode=${currentPresetName}`"
                frameborder="0"
              ></iframe>
              <iframe
                style="min-height: 366px"
                width="100%"
                height="100vh"
                :src="`https://www.yr.no/nb/innhold/${placeNumber}/card.html?mode=${currentPresetName}`"
                frameborder="0"
              ></iframe>
            </div>
          </va-card-content>
        </va-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { getDatabase, onValue, ref as storageRef, get, child } from 'firebase/database'
  import { VaCarousel, VaModal, VaCard, VaCardContent, VaCardTitle, VaButton, VaImage, useColors } from 'vuestic-ui'

  const props = defineProps<{
    data: any
    placeNumber: any
    mes: any
    trendConfig: any
  }>()
  const lastValues = ref()
  watch(
    () => props.data,
    () => {
      parseDate(props.data)
    },
  )

  function parseDate(data: any) {
    let temp = {}
    for (var i in data) {
      if (props.mes.includes(i)) {
        let offset = 0
        let factor = 1
        let unit = ''
        if (props.trendConfig[i]) {
          offset = props.trendConfig[i].offset ? props.trendConfig[i].offset : 0
          factor = props.trendConfig[i].factor ? props.trendConfig[i].factor : 1
          unit = props.trendConfig[i].unit ? props.trendConfig[i].unit : ' '
        }
        let value = (data[i][data[i].length - 1]._value + offset) * factor
        let time = data[i][data[i].length - 1]._time
        temp[i] = { value: value, name: i, time: time, unit: unit }
      }
    }

    lastValues.value = temp

    // let temp = keys.pop()

    // var temp2 = new Date(lastValues.value.time * 1000)
    // temp2.setHours(temp2.getHours() - 4)
    // lastValues.value.time = temp2.toLocaleString()

    // temp2.setHours(temp2.getHours() - 4)
    // lastValues.value.time = temp2.toLocaleString()
  }
  const { t } = useI18n()
  const { currentPresetName } = useColors()

  watch(currentPresetName, async (newCurrentPresetName, oldCurrentPresetName) => {
    console.log('changing from dashboard:', newCurrentPresetName)
  })

  const infoTiles = ref([
    {
      color: 'success',
      value: '803',
      text: 'commits',
      icon: '',
    },
    {
      color: 'danger',
      value: '57',
      text: 'components',
      icon: '',
    },
    {
      color: 'info',
      value: '5',
      text: 'teamMembers',
      icon: '',
    },
  ])

  const modal = ref(false)
  const currentImageIndex = ref(0)
  const images = ref([
    'https://i.imgur.com/qSykGko.jpg',
    'https://i.imgur.com/jYwT08D.png',
    'https://i.imgur.com/9930myH.jpg',
    'https://i.imgur.com/2JxhWD6.jpg',
    'https://i.imgur.com/MpiOWbM.jpg',
  ])

  function showModal() {
    modal.value = true
  }
</script>

<style lang="scss" scoped>
  .row-separated {
    .flex + .flex {
      border-left: 1px solid var(--va-background-primary);
    }
  }

  .rich-theme-card-text {
    line-height: 1.5;
  }

  .gallery-carousel {
    width: 80vw;
    max-width: 100%;

    @media all and (max-width: 576px) {
      width: 100%;
    }
  }
</style>
