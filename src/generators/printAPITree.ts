import {TreeNode} from './buildAPITree'
import {indent} from './indent'
import {typeFromParameter} from './typeFromParameter'
import {interfaceFromParameters} from './interfaceFromParameters'
import fastCase from 'fast-case'

const HTTP_ACTIONS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch']

function printActions(tree: TreeNode, prefix: string, types: Set<string>, imports: Set<string>) {
  if (!tree.actions) {
    return ''
  }

  let actions = ''

  for (const method of HTTP_ACTIONS) {
    const methodDefinition = tree.actions[method]

    if (!methodDefinition) continue

    const successCodes = Object.keys(methodDefinition.responses).filter(
      code => parseInt(code, 10) >= 200 && parseInt(code, 10) <= 299,
    )
    const successResponseTypes = new Set<string>()
    for (const successCode of successCodes) {
      const successResponse = methodDefinition.responses[successCode]
      successResponseTypes.add(typeFromParameter(successResponse.schema, imports, prefix))
    }

    if (methodDefinition.parameters) {
      const typeDef = interfaceFromParameters(
        `${fastCase.pascalize(methodDefinition.operationId)}Params`,
        '',
        tree.actions.parameters
          ? [...tree.actions.parameters, ...methodDefinition.parameters]
          : methodDefinition.params,
        imports,
        prefix,
      )
      types.add(typeDef)
    }

    actions +=
      `
'${method}': (): ${Array.from(successResponseTypes).join(' | ')} => {
  return httpClient.${method}()
},
    `.trim() + '\n'
  }

  return actions
}

export function printAPITree(
  tree: TreeNode,
  prefix: string,
  types = new Set<string>(),
  imports = new Set<string>(),
): string {
  if (tree.name === '/') {
    const client = `
export const client = {
${indent(tree.children.map(child => printAPITree(child, prefix, types, imports)).join('\n'), '  ')}
}
    `.trim()

    return `
import {httpClient} from '../httpClient'
${Array.from(imports).join('\n')}

${Array.from(types).join('\n\n').length}

${client}
    `.trim()
  }

  const actions = printActions(tree, prefix, types, imports)
  const children = tree.children.map(child => printAPITree(child, prefix, types, imports)).join('\n')
  const definition = `${actions}${children}`.trim()

  return `
'${tree.name}': {
${indent(definition, '  ')}
},
  `.trim()
}
