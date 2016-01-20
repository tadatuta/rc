
var n = 'rc'+Math.random()
var assert = require('assert')


// Basic usage
process.env[n+'_someOpt__a'] = 42
process.env[n+'_someOpt__x__'] = 99
process.env[n+'_someOpt__a__b'] = 186
process.env[n+'_someOpt__a__b__c'] = 243
process.env[n+'_someOpt__x__y'] = 1862
process.env[n+'_someOpt__z'] = 186577

// Should ignore empty strings from orphaned '__'
process.env[n+'_someOpt__z__x__'] = 18629
process.env[n+'_someOpt__w__w__'] = 18629

// Leading '__' should ignore everything up to 'z'
process.env[n+'___z__i__'] = 9999

var config = require('../')(n, {
  option: true
})

console.log('\n\n------ nested-env-vars ------\n',config)

assert.equal(config.merged.option, true)
assert.equal(config.merged.someOpt.a, 42)
assert.equal(config.merged.someOpt.x, 99)
// Should not override `a` once it's been set
assert.equal(config.merged.someOpt.a/*.b*/, 42)
// Should not override `x` once it's been set
assert.equal(config.merged.someOpt.x/*.y*/, 99)
assert.equal(config.merged.someOpt.z, 186577)
// Should not override `z` once it's been set
assert.equal(config.merged.someOpt.z/*.x*/, 186577)
assert.equal(config.merged.someOpt.w.w, 18629)
assert.equal(config.merged.z.i, 9999)
