<script lang="ts" setup>
import { createProgramInfo, drawScene, initBuffers } from '.'

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

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `

  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `

  const programInfo = createProgramInfo(gl, vsSource, fsSource)
  drawScene(gl, buffers, programInfo)
}
</script>

<template>
  <canvas id="glcanvas" width="640" height="480" />
</template>
