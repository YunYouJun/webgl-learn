<script lang="ts" setup>
// Animating textures in WebGL
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Animating_textures_in_WebGL

import { main } from './main'

const canvasRef = ref<HTMLCanvasElement>()

onMounted(() => {
  if (!canvasRef.value)
    return
  main(canvasRef.value)
})
</script>

<template>
  <canvas id="glcanvas" ref="canvasRef" width="640" height="480" />
</template>
