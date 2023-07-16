import { mat4 } from 'gl-matrix'
import { initBuffers } from './utils'
import { createProgramInfo, drawScene, loadTexture } from './utils/draw-scene'

import vsSource from './main.vert'
import fsSource from './main.frag'

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
export function main(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl')

  // If we don't have a GL context, give up now
  if (!gl) {
    alert(
      'Unable to initialize WebGL. Your browser or machine may not support it.',
    )
    return
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT)

  // createProgramInfo
  const programInfo = createProgramInfo(gl, vsSource, fsSource)

  const buffers = initBuffers(gl)
  // Load texture
  const texture = loadTexture(gl, `${import.meta.env.BASE_URL}/textures/cubetexture.png`)
  // Flip image pixels into the bottom-to-top order that WebGL expects.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  let then = 0

  // Draw the scene repeatedly
  function render(now: number) {
    now *= 0.001 // convert to seconds
    const deltaTime = now - then
    then = now

    if (!gl)
      return

    const modelViewMatrix = createModelViewMatrix()
    drawScene(gl, buffers, programInfo, texture, {
      modelViewMatrix,
      deltaTime,
    })
    cubeRotation += deltaTime

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
