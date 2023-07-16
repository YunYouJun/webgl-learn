import { initIndexBuffer, initPositionBuffer } from '../../sample5'
import { cube } from '~/utils/mdn/constants'

export function initTextureBuffer(gl: WebGLRenderingContext) {
  const textureCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(cube.textureCoordinates),
    gl.STATIC_DRAW,
  )

  return textureCoordBuffer
}

export function initNormalBuffer(gl: WebGLRenderingContext) {
  const normalBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(cube.vertexNormals),
    gl.STATIC_DRAW,
  )

  return normalBuffer
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//
export function initBuffers(gl: WebGLRenderingContext) {
  // Now create an array of positions for the square.
  const positionBuffer = initPositionBuffer(gl)
  const textureCoordBuffer = initTextureBuffer(gl)
  const indexBuffer = initIndexBuffer(gl)

  const normalBuffer = initNormalBuffer(gl)

  return {
    normal: normalBuffer,
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  }
}
