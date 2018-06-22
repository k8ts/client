export function indent(str: string, prefix: string) {
  return str
    .split('\n')
    .map(s => `${prefix}${s}`)
    .join('\n')
}
