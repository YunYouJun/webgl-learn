import { cube } from '~/utils/mdn/constants'

export function initPositionBuffer(gl: WebGLRenderingContext) {
  // Create a buffer for the square's positions.

  const positionBuffer = gl.createBuffer()

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const positions = cube.positions

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  return positionBuffer
}

export function initIndexBuffer(gl: WebGLRenderingContext) {
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = cube.indices

  // Now send the element array to GL

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW,
  )
  return indexBuffer
}

export function initColorBuffer(gl: WebGLRenderingContext) {
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ]

  // Convert the array of colors into a table for all the vertices.
  let colors: number[] = []

  for (let j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j]
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c)
  }

  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  return colorBuffer
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
  const colorBuffer = initColorBuffer(gl)
  const indexBuffer = initIndexBuffer(gl)

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  }
}
