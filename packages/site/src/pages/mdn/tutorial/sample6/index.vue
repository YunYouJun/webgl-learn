<script lang="ts" setup>
// - [在 WebGL 中使用纹理](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL)

import { mat4 } from 'gl-matrix'
import { createProgramInfo, drawScene, initBuffers, loadTexture } from './main'

import vsSource from './main.vert'
import fsSource from './main.frag'

onMounted(() => {
  main()
})

let cubeRotation = 0.0

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

  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation, // amount to rotate in radians
    [0, 0, 1],
  ) // axis to rotate around (Z)
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.7, // amount to rotate in radians
    [0, 1, 0],
  ) // axis to rotate around (Y)
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.3, // amount to rotate in radians
    [1, 0, 0],
  ) // axis to rotate around (X)

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

  // Load texture
  const texture = loadTexture(gl, `${import.meta.env.BASE_URL}/textures/cubetexture.png`)
  // Flip image pixels into the bottom-to-top order that WebGL expects.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  // createProgramInfo
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
    cubeRotation += deltaTime
    drawScene(gl, buffers, programInfo, texture, {
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
