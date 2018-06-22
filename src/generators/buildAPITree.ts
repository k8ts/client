import { Part } from "./parsePath";

interface TreeNode {
  name: string
  actions?: any
  children: TreeNode[]
  withParam?: TreeNode
}

export function buildAPITree(paths: Part[][]) {
  const tree: TreeNode = {
    name: '/',
    children: []
  }

  for (const parts of paths) {
    let node = tree

    for (const [idx, part] of parts.entries()) {
      let child = node.children.find(child => child.name === part.name)

      if (!child) {
        child = {
          name: part.name,
          children: []
        }
        node.children.push(child)
      }

      const isLastPart = idx === parts.length - 1

      if (part.arg) {
        if (child.withParam) {
          if (child.withParam.name !== part.arg) {
            throw new Error(`Duplicate name for path parameter:
  Path: ${JSON.stringify(parts)}
  Names: ${JSON.stringify(child.withParam)}
            `.trim())
          }
        } else {
          child.withParam = {
            name: part.arg,
            children: [],
            actions: isLastPart ? !!part.actions : undefined,
          }
        }

        node = child.withParam
      } else {
        if (isLastPart) {
          child.actions = !!part.actions
        }

        node = child
      }
    }
  }

  return tree
}


/*

"/api/v1/componentstatuses/{name}": {
  "get": {
   "description": "read the specified ComponentStatus",
   "consumes": [
    "/*"
   ],
   "produces": [
    "application/json",
    "application/yaml",
    "application/vnd.kubernetes.protobuf"
   ],
   "schemes": [
    "https"
   ],
   "tags": [
    "core_v1"
   ],
   "operationId": "readCoreV1ComponentStatus",
   "responses": {
    "200": {
     "description": "OK",
     "schema": {
      "$ref": "#/definitions/io.k8s.api.core.v1.ComponentStatus"
     }
    },
    "401": {
     "description": "Unauthorized"
    }
   },
   "x-kubernetes-action": "get",
   "x-kubernetes-group-version-kind": {
    "group": "",
    "kind": "ComponentStatus",
    "version": "v1"
   }
  },
*/
