import {indent} from './indent'
import {commentFromString} from './commentFromString'
import {typeFromParameter} from './typeFromParameter'

interface Parameter {
  name: string
  type: string
  description: string
  required?: boolean
}

export function interfaceFromParameters(
  name: string,
  description: string,
  parameters: Parameter[],
  imports: Set<string>,
  prefix: string = '',
) {
  const properties = parameters
    .map(parameter => {
      return `
${commentFromString(parameter.description)}
${parameter.name}${parameter.required ? ':' : '?:'} ${typeFromParameter(parameter, imports, prefix)}
    `.trim()
    })
    .join('\n\n')

  const interfaceDef =
    `
${commentFromString(description)}
export interface ${name} {
${indent(properties, '  ')}
}
    `.trim() + '\n'

  return interfaceDef
}
