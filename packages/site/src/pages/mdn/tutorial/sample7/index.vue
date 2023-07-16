<script lang="ts" setup>
// Lightning in WebGL
// https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL

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
