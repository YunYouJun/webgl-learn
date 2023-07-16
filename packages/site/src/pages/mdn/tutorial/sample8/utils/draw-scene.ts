//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.

import { mat4 } from 'gl-matrix'
import { initShaderProgram } from '../../sample3'
import type { initBuffers } from './init-buffers'
import type { initTexture } from './video'

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
export function setPositionAttribute(gl: WebGLRenderingContext, buffers: ReturnType<typeof initBuffers>, programInfo: ReturnType<typeof createProgramInfo>) {
  if (!programInfo)
    return

  const numComponents = 3
  const type = gl.FLOAT // the data in the buffer is 32bit floats
  const normalize = false // don't normalize
  const stride = 0 // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0 // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  )
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
}

// 告诉 WebGL 如何从缓冲区中提取纹理坐标
export function setTextureAttribute(gl: WebGLRenderingContext, buffers: ReturnType<typeof initBuffers>, programInfo: ReturnType<typeof createProgramInfo>) {
  const num = 2 // 每个坐标由 2 个值组成
  const type = gl.FLOAT // 缓冲区中的数据为 32 位浮点数
  const normalize = false // 不做标准化处理
  const stride = 0 // 从一个坐标到下一个坐标要获取多少字节
  const offset = 0 // 从缓冲区内的第几个字节开始获取数据
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord)
  gl.vertexAttribPointer(
    programInfo.attribLocations.textureCoord,
    num,
    type,
    normalize,
    stride,
    offset,
  )
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord)
}

// Tell WebGL how to pull out the normals from
// the normal buffer into the vertexNormal attribute.
export function setNormalAttribute(
  gl: WebGLRenderingContext,
  buffers: ReturnType<typeof initBuffers>,
  programInfo: ReturnType<typeof createProgramInfo>,
) {
  const numComponents = 3
  const type = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal)
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexNormal,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  )
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal)
}

export function createProgramInfo(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource)
  if (!shaderProgram)
    throw new Error('Failed to initialize shaders.')

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  }

  return programInfo
}

//
// Draw the scene.
//
export function drawScene(gl: WebGLRenderingContext, buffers: ReturnType<typeof initBuffers>, programInfo: ReturnType<typeof createProgramInfo>, texture: ReturnType<typeof initTexture>, options: {
  modelViewMatrix?: mat4
  deltaTime?: number
} = {}) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0) // Clear to black, fully opaque
  gl.clearDepth(1.0) // Clear everything
  gl.enable(gl.DEPTH_TEST) // Enable depth testing
  gl.depthFunc(gl.LEQUAL) // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180 // in radians
  const aspect = (gl.canvas as HTMLCanvasElement).clientWidth / (gl.canvas as HTMLCanvasElement).clientHeight
  const zNear = 0.1
  const zFar = 100.0
  const projectionMatrix = mat4.create()

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  const { modelViewMatrix } = options
  if (!modelViewMatrix)
    return

  // https://zhuanlan.zhihu.com/p/72734738
  // Set the shader uniforms
  const normalMatrix = mat4.create()
  mat4.invert(normalMatrix, modelViewMatrix)
  // 转置
  mat4.transpose(normalMatrix, normalMatrix)

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers, programInfo)
  setTextureAttribute(gl, buffers, programInfo)

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

  setNormalAttribute(gl, buffers, programInfo)

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program)

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  )
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  )
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix,
  )

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0)
  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0)

  {
    const vertexCount = 36
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
  }
}
