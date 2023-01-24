import * as THREE from "three";
import gsap from "gsap";
import * as dat from "dat.gui";
import "./style.css";
import typeFaceFont from "./node_modules/three/examples/fonts/helvetiker_regular.typeface.json";
import { FontLoader } from "./node_modules/three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "./node_modules/three/examples/jsm/geometries/TextGeometry";

import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls";

/**
 * Canvas & Scene
 */

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

/**
 * Loaders
 */

const textureLoader = new THREE.TextureLoader();
const matcapTexture1 = textureLoader.load("./textures/matcaps/1.png");
const matcapTexture2 = textureLoader.load("./textures/matcaps/2.png");
const matcapTexture3 = textureLoader.load("./textures/matcaps/3.png");
const fontLoader = new FontLoader();
const font = fontLoader.load(
  "./node_modules/three/examples/fonts/helvetiker_regular.typeface.json",
  (font) => {
    const textGeometry = new TextGeometry(`Journey to The Edge of Space`, {
      font: font,
      size: 1,
      height: 0.3,
      curveSegments: 14,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.004,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    const textMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture2,
    });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    // textGeometry.computeBoundingBox();

    // textGeometry.translate(
    //   -textGeometry.boundingBox.max.x * 0.5,
    //   -textGeometry.boundingBox.max.y * 0.5,
    //   -textGeometry.boundingBox.max.z * 0.5
    // );
    textGeometry.center();

    text.position.x = 2;
    text.position.y = 2;
    text.position.z = 10;

    scene.add(text);
  }
);

for (let i = 0; i < 250; i++) {
  const geometry = new THREE.TorusGeometry(0.3, 0.8, 16, 32);
  const material = new THREE.MeshToonMaterial({});
  const donut = new THREE.Mesh(geometry, material);
  donut.position.set(
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200
  );
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;
  const scale = Math.random();
  donut.scale.set(scale, scale, scale);
  scene.add(donut);
  console.timeEnd("donut");
}

/**
 * GUI &  Helpers
 */

const gui = new dat.GUI();

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

/**
 * Parameters
 */

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const parameters = {
  color: 0xf3f3f3,
  rotatePlaneX: () => {
    gsap.to(plane.rotation, {
      x: plane.rotation.x + Math.PI * 2,
    });
  },
};

let aspectRatio = sizes.width / sizes.height;
/**
 * Objects
 */

const material = new THREE.MeshToonMaterial({ color: parameters.color });
material.side = THREE.DoubleSide;
const geometry = new THREE.SphereGeometry(1.5);
const sphere = new THREE.Mesh(geometry, material);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(2.5, 0.2, 16, 32),
  material
);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.5, 16, 5), material);
torus.position.set(-3, 0, 0);
plane.position.set(1, 0, 0);
scene.add(sphere, torus, plane);

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.set(2, 3, 17);

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
 * Debugger
 */

gui.add(parameters, "rotatePlaneX").name("Rotate Plane X");

gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
});

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
  torus.position.x = Math.sin(elapsedTime);

  /**
   * Animate Plane
   */
  plane.position.x = Math.cos(elapsedTime);

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();
