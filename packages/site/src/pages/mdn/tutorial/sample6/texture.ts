import type { createProgramInfo, initBuffers } from './main'

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
