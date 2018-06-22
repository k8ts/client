import fs from 'fs-extra'
import path from 'path'
import { interfaceFromDefinition } from './generators/interfaceFromDefinition';
import { interfaceFromParameters } from './generators/interfaceFromParameters';
import { parsePath } from './generators/parsePath';
import { buildAPITree } from './generators/buildAPITree';

const log = (thing: any) => console.log(JSON.stringify(thing, null, 2))

async function generateDefinitionType(version: string, api: any, fullname: string) {
  const definition = api.definitions[fullname]

  const parts = fullname.replace('io.k8s.', '').split('.')
  const apiDir = path.join(__dirname, '..', 'src', 'k8s', version, ...parts.slice(0, -1))
  await fs.mkdirp(apiDir)

  const name = parts.slice(-1)
  const filename = path.join(apiDir, `${name}.ts`)

  const contents = interfaceFromDefinition(fullname, definition, version)
  await fs.writeFile(filename, contents)
}

const actions = {
  "get": {
   "description": "watch changes to an object of kind Namespace",
   "consumes": [
    "*/*"
   ],
   "produces": [
    "application/json",
    "application/yaml",
    "application/vnd.kubernetes.protobuf",
    "application/json;stream=watch",
    "application/vnd.kubernetes.protobuf;stream=watch"
   ],
   "schemes": [
    "https"
   ],
   "tags": [
    "core_v1"
   ],
   "operationId": "watchCoreV1Namespace",
   "responses": {
    "200": {
     "description": "OK",
     "schema": {
      "$ref": "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.WatchEvent"
     }
    },
    "401": {
     "description": "Unauthorized"
    }
   },
   "x-kubernetes-action": "watch",
   "x-kubernetes-group-version-kind": {
    "group": "",
    "kind": "Namespace",
    "version": "v1"
   }
  },
  "parameters": [
   {
    "uniqueItems": true,
    "type": "string",
    "description": "The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server the server will respond with a 410 ResourceExpired error indicating the client must restart their list without the continue field. This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.",
    "name": "continue",
    "in": "query"
   },
   {
    "uniqueItems": true,
    "type": "string",
    "description": "A selector to restrict the list of returned objects by their fields. Defaults to everything.",
    "name": "fieldSelector",
    "in": "query"
   },
   {
    "uniqueItems": true,
    "type": "boolean",
    "description": "If true, partially initialized resources are included in the response.",
    "name": "includeUninitialized",
    "in": "query"
   },
   {
    "uniqueItems": true,
    "type": "string",
    "description": "A selector to restrict the list of returned objects by their labels. Defaults to everything.",
    "name": "labelSelector",
    "in": "query"
   },
   {
    "uniqueItems": true,
    "type": "integer",
    "description": "limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.\n\nThe server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.",
    "name": "limit",
    "in": "query"
   },
   {
    "uniqueItems": true,
    "type": "string",
    "description": "name of the Namespace",
    "name": "name",
    "in": "path",
    "required": true
   },
   {
    "uniqueItems": true,
    "type": "string",
    "description": "If 'true', then the output is pretty printed.",
    "name": "pretty",
    "in": "query"
   },
   {
    "uniqueItems": true,
    "type": "string",
    "description": "When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history. When specified for list: - if unset, then the result is returned from remote storage based on quorum-read flag; - if it's 0, then we simply return what we currently have in cache, no guarantee; - if set to non zero, then the result is at least as fresh as given rv.",
    "name": "resourceVersion",
    "in": "query"
   },
   {
    "uniqueItems": true,
    "type": "integer",
    "description": "Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.",
    "name": "timeoutSeconds",
    "in": "query"
   },
   {
    "uniqueItems": true,
    "type": "boolean",
    "description": "Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.",
    "name": "watch",
    "in": "query"
   }
  ]
 }

async function generate(version: string) {
  const api = require(`../apis/${version}.json`)

  // const definitions = Object.keys(api.definitions)
  // for (const definition of definitions) {
  //   await generateDefinitionType(version, api, definition)
  // }

  const paths = Object.keys(api.paths).map(pathStr => parsePath(pathStr, api.paths[pathStr]))
  const apiTree = buildAPITree(paths)
  log(apiTree)
  log(actions.get)
  console.log(interfaceFromParameters('name', '', actions.parameters, '1.10'))
  // log(Object.keys(api.paths))
}

async function run() {
  // await generate('1.7')
  // await generate('1.8')
  // await generate('1.9')
  await generate('1.10')
}

run().catch(err => {
  console.error(err)
})
