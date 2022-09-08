import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Perlin from "./perlin";
import { TextureLoader } from "three";

const width = window.innerWidth;
const height = window.innerHeight;
var scene = new THREE.Scene();
var clock = new THREE.Clock();
var mixer;
scene.background = new THREE.Color(0xe0e0e0);
scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);
scene.background = new THREE.Color("#808080");

var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.25,
  100
);
camera.position.set(-5, 3, 10);
camera.lookAt(new THREE.Vector3(0, 2, 0));
var renderer = new THREE.WebGLRenderer({ antialias: true });

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, 20, 10);
scene.add(dirLight);

const mesh = new THREE.Mesh(
  new THREE.PlaneGeometry(2000, 2000),
  new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
);
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;

scene.add(mesh);
//var characterControls = new CharacterController();
const loader = new GLTFLoader();
loader.load(
  "../model/RobotExpressive.glb",
  function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });
    scene.add(model);

    const gltfAnimations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);
    const animationsMap = new Map();
    gltfAnimations
      .filter((a) => a.name != "TPose")
      .forEach((a) => {
        animationsMap.set(a.name, mixer.clipAction(a));
      });
    animationsMap.forEach((value, key) => {
      if (key == "Wave") {
        //console.log(value);
        value.play();
      }
      console.log(key);
    });
  },
  undefined,
  function (e) {
    console.error(e);
  }
);
var keysPressed = {};
document.addEventListener(
  "keydown",
  (event) => {
    keysPressed[event.key.toLowerCase()] = true;

    console.log(keysPressed);
  },
  false
);
document.addEventListener(
  "keyup",
  (event) => {
    keysPressed[event.key.toLowerCase()] = false;
    console.log(keysPressed);
  },
  false
);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
const controls = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  var delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();
