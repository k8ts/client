import fs from 'fs-extra'
import path from 'path'
import {interfaceFromDefinition} from './generators/interfaceFromDefinition'
import {interfaceFromParameters} from './generators/interfaceFromParameters'
import {parsePath} from './generators/parsePath'
import {buildAPITree} from './generators/buildAPITree'
import {printAPITree} from './generators/printAPITree'

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

async function generate(version: string) {
  const api = require(`../apis/${version}.json`)

  const definitions = Object.keys(api.definitions)
  for (const definition of definitions) {
    await generateDefinitionType(version, api, definition)
  }

  const paths = Object.keys(api.paths).map(pathStr => parsePath(pathStr, api.paths[pathStr]))
  const apiTree = buildAPITree(paths)
  const generatedAPI = printAPITree(apiTree, version)
  console.log(generatedAPI)

  await fs.writeFile(path.join(__dirname, '..', 'src', 'client.ts'), generatedAPI)
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
