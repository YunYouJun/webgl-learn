<script lang="ts" setup>
import { mat4 } from 'gl-matrix'
import { createProgramInfo, drawScene, initBuffers } from '../sample3'
import fsSource from '../sample3/main.frag'
import vsSource from '../sample3/main.vert'

onMounted(() => {
  main()
})

let squareRotation = 0.0

function createModelViewMatrix() {
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create()

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0],
  ) // amount to translate

  mat4.rotate(modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    squareRotation, // amount to rotate in radians
    [0, 0, 1]) // axis to rotate around

  return modelViewMatrix
}

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

  const programInfo = createProgramInfo(gl, vsSource, fsSource)

  let then = 0

  // Draw the scene repeatedly
  function render(now: number) {
    now *= 0.001 // convert to seconds
    const deltaTime = now - then
    then = now

    if (!gl)
      return

    const modelViewMatrix = createModelViewMatrix()
    squareRotation += deltaTime
    drawScene(gl, buffers, programInfo, {
      modelViewMatrix,
      deltaTime,
    })

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
</script>

<template>
  <canvas id="glcanvas" width="640" height="480" />
</template>
