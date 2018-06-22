import { indent } from "./indent";
import { commentFromString } from "./commentFromString";
import { typeFromParameter } from "./typeFromParameter";


export function interfaceFromDefinition(id: string, definition: any, prefix: string = '') {
  const imports = new Set<string>()

  const ifaceParts = id.replace('io.k8s.', '').split('.')
  const name = ifaceParts.slice(-1)[0]

  const required = new Set<string>()
  if (definition.required) {
    for (const prop of definition.required) {
      required.add(prop)
    }
  }

  const properties = definition.properties ? Object.keys(definition.properties).map(key => {
    const property = definition.properties[key]
    const isRequired = required.has(key)

    return `
${commentFromString(property.description)}
${key}${isRequired ? ':' : '?:'} ${typeFromParameter(property, imports, prefix)}
    `.trim()
  }).join('\n\n') : ''

  const interfaceDef = `
${Array.from(imports).join('\n')}

${commentFromString(definition.description)}
export interface ${name} {
${indent(properties, '  ')}
}
  `.trim() + '\n'

  return interfaceDef
}
