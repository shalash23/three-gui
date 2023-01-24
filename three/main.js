import * as THREE from "three";
import * as gsap from "gsap";
import * as dat from "dat.gui";
import "./style.css";

import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls";
import { PlaneGeometry } from "three";

/**
 * Canvas & Scene
 */

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

/**
 * Parameters
 */

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const parameters = {
  color: new THREE.Color(0xf3f3f3),
};

let aspectRatio = sizes.width / sizes.height;
/**
 * Objects
 */

const material = new THREE.MeshToonMaterial({ color: parameters.color });
material.side = THREE.DoubleSide;
const geometry = new THREE.SphereBufferGeometry(0.5);
const sphere = new THREE.Mesh(geometry, material);
const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.5, 0.2, 16, 32),
  material
);

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(0.2, 0.5, 16, 5),
  material
);
torus.position.set(3, 0, 0);
plane.position.set(-2, 0, 0);
scene.add(sphere, torus, plane);

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(2, 3, 5);

camera.lookAt(sphere.position);

/**
 * Lightings
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);

scene.add(ambientLight, pointLight);

/**
 * Orbit Controls
 */

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height, true);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.render(scene, camera);

/**
 * Resize Event Listeners
 */

window.addEventListener("resize", () => {
  // Getting the height and width
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  aspectRatio = sizes.width / sizes.height;

  // Updating the camera
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});

/**
 * Animation Function
 */

const clock = new THREE.Clock();

function tick() {
  const elapsedTime = clock.getElapsedTime();
  /**
   * Animate Sphere
   */
  sphere.rotation.y = elapsedTime * 0.3;
  sphere.position.x = Math.sin(elapsedTime);
  /**
   * Animate torus
   */
  torus.rotation.x = 0.3 * elapsedTime;
  torus.position.x = Math.sin(elapsedTime);

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();
