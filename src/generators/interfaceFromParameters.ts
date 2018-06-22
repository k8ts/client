import { indent } from "./indent";
import { commentFromString } from "./commentFromString";
import { typeFromParameter } from "./typeFromParameter";

interface Parameter {
  name: string
  type: string
  description: string
  required?: boolean
}

export function interfaceFromParameters(name: string, description: string, parameters: Parameter[], prefix: string = '') {
  const imports = new Set<string>()

  const properties = parameters.map(parameter => {
    return `
${commentFromString(parameter.description)}
${parameter.name}${parameter.required ? ':' : '?:'} ${typeFromParameter(parameter, imports, prefix)}
    `.trim()
  }).join('\n\n')

  const interfaceDef = `
${Array.from(imports).join('\n')}

${commentFromString(description)}
export interface ${name} {
${indent(properties, '  ')}
}
  `.trim() + '\n'

  return interfaceDef
}
