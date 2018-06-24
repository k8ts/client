export interface OpenAPIParameter {
  type?: string
  $ref?: string
  items?: OpenAPIParameter
  schema?: {
    $ref?: string
  }
}

function typeFromReference(ref: string, imports: Set<string>, prefix: string) {
  const refName = ref.replace('#/definitions/io.k8s.', '')
  const refParts = refName.split('.')
  const refType = refParts.slice(-1)
  const refImport = `import {${refType}} from '@k8s/${prefix ? `${prefix}/` : ''}${refParts.join('/')}'`
  imports.add(refImport)
  return refType[0]
}

export function typeFromParameter(param: OpenAPIParameter, imports: Set<string>, prefix: string): string {
  if (param.$ref) {
    return typeFromReference(param.$ref, imports, prefix)
  }

  if (param.schema && param.schema.$ref) {
    return typeFromReference(param.schema.$ref, imports, prefix)
  }

  if (param.type) {
    switch (param.type) {
      case 'array':
        if (param.items) {
          return `Array<${typeFromParameter(param.items, imports, prefix)}>`
        }

      case 'integer':
        return 'number'

      default:
        // pass type through
        return param.type
    }
  }

  throw new Error('Parameter was missing a type' + JSON.stringify(param))
}
