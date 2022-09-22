import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

console.log(dat)
//tweakable parameters
const parameters = {
    color: 0xff0000,
    spin: () =>
    {
        gsap.to(group.rotation, { duration: 1, y: group.rotation.y + Math.PI * 2 })
    }
}

//scene
const scene = new THREE.Scene()
const canvas = document.querySelector('canvas')

//textures
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
loadingManager.onStart = () =>
{
    console.log('loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loading finished')
}
loadingManager.onProgress =() =>
{
    console.log('loading in progress')
}
loadingManager.onError = () =>
{
    console.log('loading error')
}
const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

//materials
const material = new THREE.MeshStandardMaterial({color: 0x888888, wireframe: false, shininess: 100})
const woodMaterial = new THREE.MeshBasicMaterial({map: colorTexture})
const matcapMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})

//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)



//objects
const group = new THREE.Group()
//.scale.y = 2
group.rotation.y = 0.2
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1, 2, 2, 2),
    material
)
cube1.position.x = -1.5
group.add(cube1)

const ball1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)
group.add(ball1)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    matcapMaterial
)
torus.position.x = 2
group.add(torus)

//axes helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('dblclick', () => {
    if(!fullscreenElement){
        canvas.requestFullscreen()
        console.log('go fullscreen')
    }else {
        document.exitFullscreen()
        console.log('leave fullscreen')
    }
})

window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    //
    //update tamera aspect
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//camera
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height)
const aspectRatio = sizes.width / sizes.height
//widthconst camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)
camera.position.z = 3
camera.position.y = 0.2
camera.lookAt(group.position)
scene.add(camera)

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

//cursor
const cursor = {
    x: 0, y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -( event.clientY / sizes.height - 0.5 )
    //console.log(cursor.x, cursor.y)
})

//OrbitControls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//debug
const gui = new dat.GUI()
gui.add(group.position, 'y').min(-3).max(3).step(0.01).name('elevation')
gui.add(group, 'visible')
gui.add(material, 'wireframe')
gui.addColor(parameters, 'color').onChange(() =>
{
    material.color.set(parameters.color)
})
gui.add(parameters, 'spin')
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)


//animate
//gsap.to(group.position, {duration: 1, delay: 1, x: 2})
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    //camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    //camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    //camera.position.y = cursor.y * 5
    //camera.lookAt(group.position)
    cube1.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime
    renderer.render(scene, camera)
    controls.update()
    window.requestAnimationFrame(tick)
}   
tick()
