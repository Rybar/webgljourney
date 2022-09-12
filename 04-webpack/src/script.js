import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

//scene
const scene = new THREE.Scene()

//objects
const group = new THREE.Group()
group.scale.y = 2
group.rotation.y = 0.2
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0x008800})
    )
cube1.position.x = -1.5
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0x000099})
)
cube2.position.x = 0
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0x440088})
)
cube3.position.x = -0.2
cube3.position.y = 0.25
cube3.position.z = 0.4
group.add(cube3)


//axes helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

const sizes = {
    width: 800,
    height: 600
}

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.y = 0.2
camera.lookAt(group.position)
scene.add(camera)

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas')
})
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()

//animate
gsap.to(group.position, {duration: 1, delay: 1, x: 2})
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    camera.position.x = Math.sin(elapsedTime)
    camera.position.y = Math.cos(elapsedTime)
    camera.lookAt(group.position)
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}   
tick()
