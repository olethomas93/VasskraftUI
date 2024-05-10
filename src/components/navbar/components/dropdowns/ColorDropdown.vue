<template>
  <va-switch
    v-model="currentTheme"
    class="color-dropdown__toggle"
    outline
    true-value="light"
    false-value="dark"
    off-color="#5123a1"
    color="#ffd300"
    round
    grow
    size="small"
  >
    <template #innerLabel>
      <div class="va-text-center">
        <VaIcon :name="currentTheme === 'dark' ? 'dark_mode' : 'light_mode'" />
      </div>
    </template>
  </va-switch>
</template>

<script setup lang="ts">
  import { useColors } from 'vuestic-ui'
  import { ref, watchEffect } from 'vue'

  const { presets, applyPreset, colors } = useColors()

  const currentTheme = ref('light')

  watchEffect(() => {
    applyPreset(currentTheme.value)
  })
</script>

<style lang="scss" scoped>
  .color-dropdown {
    &__icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .va-dropdown__anchor {
      display: inline-block;
    }

    &__toggle {
      width: 100%;
      display: flex;
      justify-content: stretch;
    }
  }

  .button-restore {
    display: flex;
    margin: 0.375rem auto;
  }
</style>
