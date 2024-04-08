// HelloCanvas.js (c) 2012 matsuda
export function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById('webgl')

  // Get the rendering context for WebGL
  // @ts-expect-error get from cdn

  const gl = getWebGLContext(canvas)
  if (!gl) {
    // eslint-disable-next-line no-console
    console.log('Failed to get the rendering context for WebGL')
    return
  }

  // Set clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)
}
