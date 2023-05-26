<script lang="ts" setup>
import fsSource from './main.frag'
import vsSource from './main.vert'
import { createModelViewMatrix, createProgramInfo, drawScene, initBuffers } from '.'

onMounted(() => {
  main()
})

/**
 * Start here
 */
function main() {
  const canvas = document.querySelector('#glcanvas') as HTMLCanvasElement
  const gl = canvas.getContext('webgl')

  // If we don't have a GL context, give up now

  if (!gl) {
    alert(
      'Unable to initialize WebGL. Your browser or machine may not support it.',
    )
    return
  }

  const buffers = initBuffers(gl)

  // Vertex shader program

  const programInfo = createProgramInfo(gl, vsSource, fsSource)
  const modelViewMatrix = createModelViewMatrix()
  drawScene(gl, buffers, programInfo, {
    modelViewMatrix,
  })
}
</script>

<template>
  <canvas id="glcanvas" width="640" height="480" />
</template>
