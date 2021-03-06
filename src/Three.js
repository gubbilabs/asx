// import SpriteSheet from './SpriteSheet.js'
// import util from './util.js'
import Meshes from './ThreeMeshes'

import THREE from '../dist/three.wrapper.js'
import '../dist/OrbitControls.wrapper.js'
import Stats from '../dist/stats.wrapper.js'
import dat from '../dist/dat.gui.wrapper.js'

window.Meshes = Meshes // REMIND

class Three {
  static defaultOptions (useThreeHelpers = true, useUIHelpers = true) {
    const options = {
    // include me in options so Model can instanciate me!
      Renderer: Three, // REMIND: use string.
      orthoView: false,             // 'Perspective', 'Orthographic'
      clearColor: 0x000000,         // clear to black
      useAxes: useThreeHelpers,     // show x,y,z axes
      useGrid: useThreeHelpers,     // show x,y plane
      useControls: useThreeHelpers, // navigation. REMIND: control name?
      useStats: useUIHelpers,       // show fps widget
      useGUI: useUIHelpers,         // activate dat.gui UI
      meshes: {
        patches: {
          meshClass: 'PatchesMesh',
          z: 1.0
        },
        turtles: {
          meshClass: 'QuadSpritesMesh',
          z: 2.0
        },
        links: {
          meshClass: 'LinksMesh',
          z: 1.5
        }
      }
    }
    // for (const meshKey in options.meshes) {
    //   const meshVal = options.meshes[meshKey]
    //   const Mesh = Meshes[meshVal.meshClass]
    //   const meshOptions = Mesh.options()
    //   if (meshOptions) meshVal.options = meshOptions
    // }
    return options
  }
  static printMeshOptions () {
    const obj = {}
    for (const MeshName in Meshes) {
      const optionsFcn = Meshes[MeshName].options
      if (optionsFcn) {
        obj[MeshName] = {
          options: Meshes[MeshName].options()
        }
      }
    }
    const json = JSON.stringify(obj, null, '  ')
    console.log(json.replace(/ {2}"/g, '  ').replace(/": /g, ': '))
  }

  constructor (model, options = {}) {
    this.model = model
    // this.spriteSheet = model.spriteSheet // REMIND: Temp

    // Initialize options
    Object.assign(this, Three.defaultOptions) // install defaults
    Object.assign(this, options) // override defaults
    if (this.Renderer !== Three)
      throw Error('Three ctor: Renderer not Three', this.renderer)

    // Initialize Three.js
    this.initThree()
    this.initThreeHelpers()
  }
  // Init Three.js core: scene, camera, renderer
  initThree () {
    const {clientWidth, clientHeight} = this.model.div
    const {orthoView, clearColor} = this
    const {width, height} = this.model.world
    const [halfW, halfH] = [width / 2, height / 2]

    // this.spriteSheet.texture = new THREE.CanvasTexture(this.spriteSheet.ctx)
    // this.spriteSheet.setTexture(THREE.CanvasTexture)

    const scene = new THREE.Scene()
    const camera = orthoView
      ? new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 1, 1000)
      : new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 1, 10000)

    if (orthoView)
      camera.position.set(0, 0, 100 * width)
    else
      camera.position.set(width, -width, width)
    camera.up.set(0, 0, 1)

    const renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(clientWidth, clientHeight)
    renderer.setClearColor(clearColor)
    this.model.div.appendChild(renderer.domElement)

    window.addEventListener('resize', () => {
      const {clientWidth, clientHeight} = this.model.div
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
    })

    Object.assign(this, {scene, camera, renderer})
  }
  initThreeHelpers () {
    const {scene, renderer, camera} = this
    const {useAxes, useGrid, useControls, useStats, useGUI} = this
    const {width} = this.model.world
    const helpers = {}

    if (useAxes) {
      helpers.axes = new THREE.AxisHelper(1.5 * width / 2)
      scene.add(helpers.axes)
    }
    if (useGrid) {
      helpers.grid = new THREE.GridHelper(1.25 * width, 10)
      helpers.grid.rotation.x = THREE.Math.degToRad(90)
      scene.add(helpers.grid)
    }
    if (useControls) {
      helpers.controls = new THREE.OrbitControls(camera, renderer.domElement)
      // helpers.controls = OrbitControls // REMIND: legacy vs modules
      //   ? new OrbitControls(camera, renderer.domElement)
      //   : new THREE.OrbitControls(camera, renderer.domElement)
    }
    if (useStats) {
      helpers.stats = new Stats()
      // This does not work: helpers.stats.dom.style.position = 'absolute'
      document.body.appendChild(helpers.stats.dom)
    }
    if (useGUI) {
      helpers.gui = new dat.GUI() // auto adds to body, appendChild not needed
    }

    Object.assign(this, helpers)
  }
}

export default Three
