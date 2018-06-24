import {Part} from './parsePath'

export interface TreeNode {
  name: string
  actions?: any
  children: TreeNode[]
  withParam?: TreeNode
}

export function buildAPITree(paths: Part[][]) {
  const tree: TreeNode = {
    name: '/',
    children: [],
  }

  for (const parts of paths) {
    let node = tree

    for (const [idx, part] of parts.entries()) {
      let child = node.children.find(child => child.name === part.name)

      if (!child) {
        child = {
          name: part.name,
          children: [],
        }
        node.children.push(child)
      }

      const isLastPart = idx === parts.length - 1

      if (part.arg) {
        if (child.withParam) {
          if (child.withParam.name !== part.arg) {
            throw new Error(
              `Duplicate name for path parameter:
  Path: ${JSON.stringify(parts)}
  Names: ${JSON.stringify(child.withParam)}
            `.trim(),
            )
          }
        } else {
          child.withParam = {
            name: part.arg,
            children: [],
            actions: isLastPart ? part.actions : undefined,
          }
        }

        node = child.withParam
      } else {
        if (isLastPart) {
          child.actions = part.actions
        }

        node = child
      }
    }
  }

  return tree
}
