import type { initBuffers } from './init-buffers'
import type { createProgramInfo } from './draw-scene'

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
