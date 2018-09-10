
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

const Util = require('./util')
const CONFIG = require('./config')

const appPath = process.cwd()
const configDir = path.join(appPath, Util.PROJECT_CONFIG)
const projectConfig = require(configDir)(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
const outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
const sourceDir = path.join(appPath, sourceDirName)
const outputDir = path.join(appPath, outputDirName)
const entryFilePath = Util.resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)
const outputEntryFilePath = path.join(outputDir, entryFileName)

let isProduction = false

function buildProjectConfig () {
  const projectConfigPath = path.join(appPath, 'manifest.json')
  if (!fs.existsSync(projectConfigPath)) {
    return
  }
  const origProjectConfig = fs.readJSONSync(projectConfigPath)
  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(Object.assign({}, origProjectConfig), null, 2)
  )
  Util.printLog(Util.pocessTypeEnum.GENERATE, '项目配置', `${outputDirName}/manifest.json`)
}

async function build ({ watch }) {
  console.log('quickapp build')
  process.env.TARO_ENV = Util.BUILD_TYPES.QUICKAPP
  isProduction = !watch
  buildProjectConfig()
  // copyFiles()
  // appConfig = await buildEntry()
  // await buildPages()
  // if (watch) {
  //   watchFiles()
  // }
}

module.exports = {
  build
}
