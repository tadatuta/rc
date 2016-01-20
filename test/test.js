
var n = 'rc'+Math.random()
var assert = require('assert')

process.env[n+'_envOption'] = 42

var config = require('../')(n, {
  option: true
})

console.log(config)

assert.equal(config.merged.option, true)
assert.equal(config.merged.envOption, 42)

var customArgv = require('../')(n, {
  option: true
}, { // nopt-like argv
  option: false,
  envOption: 24,
  argv: {
    remain: [],
    cooked: ['--no-option', '--envOption', '24'],
    original: ['--no-option', '--envOption=24']
  }
})

console.log(customArgv)

assert.equal(customArgv.merged.option, false)
assert.equal(customArgv.merged.envOption, 24)

var fs = require('fs')
var path = require('path')
var jsonrc = path.resolve('.' + n + 'rc');
var jsonrcParent = path.resolve('..', '.' + n + 'rc');

fs.writeFileSync(jsonrc, [
  '{',
    '// json overrides default',
    '"option": false,',
    '/* env overrides json */',
    '"envOption": 24',
  '}'
].join('\n'));

fs.writeFileSync(jsonrcParent, [
  '{',
    '"parentOpt": true,',
    '"envOption": 12',
  '}'
].join('\n'));

var commentedJSON = require('../')(n, {
  option: true
})

fs.unlinkSync(jsonrc);
fs.unlinkSync(jsonrcParent);

console.log(commentedJSON)

assert.equal(commentedJSON.merged.option, false)
assert.equal(commentedJSON.merged.parentOpt, true)
assert.equal(commentedJSON.merged.envOption, 42)

assert.equal(commentedJSON.configs.length, 5)
assert.equal(commentedJSON.configs[1].parentOpt, true)
