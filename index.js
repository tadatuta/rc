#! /usr/bin/env node
var cc   = require('./lib/utils')
var join = require('path').join
var deepExtend = require('deep-extend')
var etc = '/etc'
var win = process.platform === "win32"
var home = win
           ? process.env.USERPROFILE
           : process.env.HOME

module.exports = function (name, defaults, argv, parse) {
  if('string' !== typeof name)
    throw new Error('rc(name): name *must* be string')
  if(!argv)
    argv = require('minimist')(process.argv.slice(2))
  defaults = (
      'string' === typeof defaults
    ? cc.json(defaults) : defaults
    ) || {}

  parse = parse || cc.parse

  var env = cc.env(name + '_')

  var configs = []
  var configFiles = []
  function addConfigFile (file) {
    if (configFiles.indexOf(file) >= 0) return
    var fileConfig = cc.file(file)
    if (fileConfig) {
      var parsedConfig = parse(fileConfig)
      parsedConfig.__source = file
      configs.push(parsedConfig)
      configFiles.push(file)
    }
  }

  // which files do we look at?
  if (!win)
   [join(etc, name, 'config'),
    join(etc, name + 'rc')].forEach(addConfigFile)
  if (home)
   [join(home, '.config', name, 'config'),
    join(home, '.config', name),
    join(home, '.' + name, 'config'),
    join(home, '.' + name + 'rc')].forEach(addConfigFile)
  cc.find('.'+name+'rc').forEach(addConfigFile)

  if (env.config) addConfigFile(env.config)
  if (argv.config) addConfigFile(argv.config)

  return [defaults].concat(configs, env.length ? env : [])
}

if(!module.parent) {
  console.log(
    JSON.stringify(module.exports(process.argv[2]), false, 2)
  )
}
