function isParameter(part: string) {
  const match = /^\{(.*)\}$/.exec(part)
  if (!match) {
    return null
  }
  return match[1]
}

export interface Part {
  name: string
  arg?: string
  actions?: any
}

// paramOverrides allows renaming
interface ParamOverrides {
  [path: string]: [string, string][]
}
const paramOverrides: ParamOverrides = {
  '/api/v1/namespaces/{name}': [['name', 'namespace']],
  '/api/v1/namespaces/{name}/finalize': [['name', 'namespace']],
  '/api/v1/namespaces/{name}/status': [['name', 'namespace']],
  '/api/v1/watch/namespaces/{name}': [['name', 'namespace']]
}

export function parsePath(full: string, actions: any) {
  const stringParts = full.replace(/^\//, '').split('/').filter(s => s)
  const parts: Part[] = []

  const paramCount = stringParts.filter(p => isParameter(p)).length

  for (const [idx, stringPart] of stringParts.entries()) {
    if (isParameter(stringPart)) {
      continue
    }

    let partArg = undefined
    const lookahead = stringParts[idx + 1]
    const lookaheadParam = isParameter(lookahead)
    if (lookaheadParam) {
      partArg = lookaheadParam

      const paramOverride = paramOverrides[full]
      if (paramOverride) {
        for (const [oldParam, newParam] of paramOverride) {
          if (oldParam !== partArg) {
            continue
          }

          partArg = newParam

          for (const actionType of Object.keys(actions)) {
            const action = actions[actionType]
            if (!action.parameters) {
              continue
            }
            for (const param of action.parameters) {
              if (param.name === oldParam) {
                param.name === newParam
              }
            }
          }
        }
      }
    }

    const partActions = idx === stringParts.length - 1 - paramCount ? actions : undefined

    parts.push({
      name: stringPart,
      arg: partArg,
      actions: partActions,
    })
  }


  return parts
}
