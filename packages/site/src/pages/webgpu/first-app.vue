<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()

async function init(canvasEl: HTMLCanvasElement) {
  console.log(navigator.gpu)
  if (!navigator.gpu)
    throw new Error('WebGPU not supported on this browser.')

  const adapter = await navigator.gpu.requestAdapter()
  if (!adapter)
    throw new Error('No appropriate GPUAdapter found.')

  const device = await adapter.requestDevice()

  const context = canvasEl.getContext('webgpu')
  const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
}

onMounted(() => {
  if (!canvasRef.value)
    return
  init(canvasRef.value)
})
</script>

<template>
  <canvas ref="canvasRef" class="m-auto" width="512" height="512" />
</template>
