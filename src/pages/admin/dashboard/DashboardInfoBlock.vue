<template>
  <div class="pt-6 grid grid-cols-12 gap-6">
    <div class="col-span-12 lg:col-span-6 flex flex-wrap">
      <div class="w-full pb-6 grid grid-cols-12 gap-6">
        <va-card class="col-span-12 sm:col-span-4 mb-8" color="success">
          <va-card-content>
            <h2 v-if="lastValues" class="va-h2 m-0 text-white">{{ lastValues.sensor.toFixed(2) }}</h2>
            <p class="text-white">Målt dybde</p>
          </va-card-content>
        </va-card>
        <va-card class="col-span-12 sm:col-span-4 mb-4" color="success">
          <va-card-content>
            <h2 v-if="lastValues" class="va-h2 m-0 text-white">{{ lastValues.voltage.toFixed(2) }}</h2>
            <p class="text-white">Spenning</p>
          </va-card-content>
        </va-card>
        <va-card class="col-span-12 sm:col-span-4 mb-8" color="success">
          <va-card-content>
            <h2 v-if="lastValues" class="va-h2 m-0 text-white">{{ lastValues.time }}</h2>
            <p class="text-white">Siste timestamp</p>
          </va-card-content>
        </va-card>
      </div>

      <div class="w-full grid grid-cols-12 gap-6">
        <va-card stripe stripe-color="info" class="col-span-12 sm:col-span-12 mb-12">
          <va-card-title> </va-card-title>
          <va-card-content>
            <iframe
              style="min-height: 366px"
              width="100%"
              height="100vh"
              src="https://www.yr.no/nb/innhold/1-107561/meteogram.svg"
              frameborder="0"
            ></iframe>
          </va-card-content>
        </va-card>
      </div>
    </div>

    <div class="col-span-12 lg:col-span-6 flex flex-wrap gap-6">
      <va-card stripe stripe-color="info" class="col-span-12 sm:col-span-12 mb-12">
        <va-card-title> </va-card-title>
        <va-card-content>
          <iframe
            style="min-height: 366px"
            width="100%"
            height="100vh"
            src="https://www.yr.no/nb/innhold/1-107561/card.html"
            frameborder="0"
          ></iframe>
        </va-card-content>
      </va-card>
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
  }>()
  const lastValues = ref()
  watch(
    () => props.data,
    () => {
      parseDate(props.data)
    },
  )

  function parseDate(data: any) {
    let keys = Object.keys(data)
    let temp = keys.pop()
    lastValues.value = data[temp]
    var temp2 = new Date(lastValues.value.time * 1000)
    temp2.setHours(temp2.getHours() - 4)
    lastValues.value.time = temp2.toLocaleString()
  }
  const { t } = useI18n()
  const { colors } = useColors()

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
