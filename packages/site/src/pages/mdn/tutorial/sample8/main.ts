import { mat4 } from 'gl-matrix'
import { initBuffers } from './utils'
import { createProgramInfo, drawScene } from './utils/draw-scene'

import vsSource from './main.vert'
import fsSource from './main.frag'
import { initTexture, updateTexture } from './utils/video'

let cubeRotation = 0.0

let copyVideo = false

export function setupVideo(url: string) {
  const video = document.createElement('video')

  let playing = false
  let timeupdate = false

  video.playsInline = true
  video.muted = true
  video.loop = true

  // Waiting for these 2 events ensures
  // there is data in the video

  video.addEventListener(
    'playing',
    () => {
      playing = true
      checkReady()
    },
    true,
  )

  video.addEventListener(
    'timeupdate',
    () => {
      timeupdate = true
      checkReady()
    },
    true,
  )

  video.src = url
  video.play()

  function checkReady() {
    if (playing && timeupdate)
      copyVideo = true
  }

  return video
}

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
  const texture = initTexture(gl)
  const video = setupVideo(`${import.meta.env.BASE_URL}/videos/Firefox.mp4`)
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

    if (copyVideo)
      updateTexture(gl, texture, video)

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
