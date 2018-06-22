export interface OpenAPIParameter {
  type?: string
  $ref?: string
  items?: OpenAPIParameter
}

export function typeFromParameter(param: OpenAPIParameter, imports: Set<string>, prefix: string = ''): string {
  if (param.$ref) {
    const refName = param.$ref.replace('#/definitions/io.k8s.', '')
    const refParts = refName.split('.')
    const refType = refParts.slice(-1)
    const refImport = `import {${refType}} from '@k8s/${prefix ? `${prefix}/` : ''}${refParts.join('/')}'`
    imports.add(refImport)
    return refType[0]
  }

  if (param.type) {
    switch (param.type) {
      case 'array':
        if (param.items) {
          return `Array<${typeFromParameter(param.items, imports, prefix)}>`
        }

      case 'integer':
        return 'number'
        break

      default:
        // pass type through
        return param.type
    }
  }

  throw new Error('Parameter was missing a type')
}
