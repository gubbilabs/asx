// Import the lib/ mmodules via relative paths
import AgentSet from 'lib/AgentSet.js'
import patchProto from 'lib/Patch.js'
import Patches from 'lib/Patches.js'
import Color from 'lib/Color.js'
import ColorMap from 'lib/ColorMap.js'
import Model from 'lib/Model.js'
import util from 'lib/util.js'
window.pps = util.pps

const modules = { AgentSet, Patches, Color, ColorMap, Model, util }
util.toWindow(modules)
console.log(Object.keys(modules).join(' '))

// // constructor (model, agentClass, name, baseSet = null) {
// const foos = new AgentSet({}, {}, 'foos')
// const a = [{id: 77}, {id: 90}]
// util.toWindow({ foos, a })
//
// util.repeat(4, (i) => foos.add({}))
// foos.asSet(a)
//
// const bars = new AgentSet({}, {}, 'bars', foos)
// util.repeat(2, (i) => bars.add({}))
// const zots = new AgentSet({}, {}, 'zots', foos)
// util.repeat(2, (i) => zots.add({}))
// const foo = foos[0]
// const bar = bars[0]
// const zot = zots[0]
// util.toWindow({ bars, zots, foo, bar, zot })
//
// foos.own('foo1')
// bars.own('bar1, bar2')
// zots.own('zot1, zot2')
// console.log('foos variables', foos.ownVariables)
// console.log('bars variables', bars.ownVariables)
// console.log('zots variables', zots.ownVariables)
//
// const zot0 = zots[0]
// bars.setBreed(zot0)
// console.log('bars.setBreed(zot0)', Object.keys(zot0))
// const bar0 = bars[0]
// foos.setBreed(bar0)
// console.log('foos.setBreed(bar0)', Object.keys(bar0))
// util.toWindow({ zot0, bar0 })

const model = new Model('layers')
const world = model.world
util.toWindow({ model, world })

const patches = new Patches(model, patchProto, 'patches')
// util.repeat(5, (i) => patches.add({}))
util.toWindow({ Patches, patches })

const cmap = ColorMap.rgbColorCube(8, 8, 4)
// const cmap = ColorMap.gradientColorMap(256, ColorMap.jetColors)
// const cmap = ColorMap.cssColorMap(ColorMap.basicColorNames)
for (const p of patches) p.setColor(cmap.randomColor())
// for (const p of patches) p.setColor(Color.randomTypedColor())
patches.draw(model.contexts.patches)

const ctx = model.contexts.patches
const can = ctx.canvas
const pixels = patches.pixels
const pctx = patches.pixels.ctx
const pcan = pctx.canvas
util.toWindow({ cmap, ctx, can, pixels, pctx, pcan })
util.addToDom(pcan)

console.log('gradient: 25 values using the 9 jetColor gradient stops:')
console.log(ColorMap.gradientColorMap(25, ColorMap.jetColors).toString())
