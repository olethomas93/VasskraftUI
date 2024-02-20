import { createApp } from 'vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
import { firebaseApp } from './firebaseConfig'
import VueApexCharts from 'vue3-apexcharts'
import stores from './stores'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import App from './App.vue'
import { VueFire, VueFireAuth } from 'vuefire'

const db = getFirestore(firebaseApp)
const app = createApp(App)

app.use(stores)
app.use(router)
app.use(i18n)
app.use(VueApexCharts)
app.use(createVuestic({ config: vuesticGlobalConfig }))

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
})

if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

app.mount('#app')
