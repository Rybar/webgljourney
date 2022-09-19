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
//materials
const material = new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true})
//objects
const group = new THREE.Group()
group.scale.y = 2
group.rotation.y = 0.2
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1, 2, 2, 2),
    material
)
cube1.position.x = -1.5
group.add(cube1)

//bufferGeometry
const geometry = new THREE.BufferGeometry()
const count = 50
const positionsArray = new Float32Array(count * 3 * 3)
for (let i = 0; i < count * 3 * 3; i++)
{
    positionsArray[i] = (Math.random() - 0.5) * 4
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)
const triangle = new THREE.Mesh(
    geometry,
    material
  
)
group.add(triangle)

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


//animate
//gsap.to(group.position, {duration: 1, delay: 1, x: 2})
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    //camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    //camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    //camera.position.y = cursor.y * 5
    //camera.lookAt(group.position)
    renderer.render(scene, camera)
    controls.update()
    window.requestAnimationFrame(tick)
}   
tick()
