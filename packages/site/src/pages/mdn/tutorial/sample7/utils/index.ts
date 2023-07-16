export * from './init-buffers'

/**
 * https://chatkit.app/s/AtBbJPBPyIuCRMRH_Z7IP
 * @param value
 * @returns
 */
export function isPowerOf2(value: number) {
  return (value & (value - 1)) === 0
}
