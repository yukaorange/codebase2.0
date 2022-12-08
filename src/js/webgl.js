import { gsap } from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";
import * as dat from "lil-gui";
import jpFlag from "./textures/jp-flag.png";

export function webgl() {
  /**
   *デバッグ
   */
  const gui = new dat.GUI({ width: 300 });

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Canvas
  const canvas = document.querySelector(".webgl");

  // Scene
  const scene = new THREE.Scene();

  /**
   * Textures
   */
  const textureLoader = new THREE.TextureLoader();
  const flagTexture = textureLoader.load(jpFlag);

  // Geometry
  const geometry = new THREE.PlaneGeometry(1, 1, 32, 32); //平面ジオメトリ
  // const geometry = new THREE.PlaneGeometry(1, 1); //平面ジオメトリ
  // console.log(geometry.attributes);

  // Material
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uFrequency: {
        value: new THREE.Vector2(10, 5),
      },
      uTime: {
        value: 0,
      },
      uColor: {
        value: new THREE.Color("white"),
      },
      uTexture: {
        value: flagTexture,
      },
    },
    // wireframe:true,
  });

  /**
   *debug
   */
  gui.add(material.uniforms.uFrequency.value, "x").min(0).max(20).step(0.001);
  gui.add(material.uniforms.uFrequency.value, "y").min(0).max(20).step(0.001);

  // Mesh
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.y = 1 / 3;
  scene.add(mesh);

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(0.25, -0.25, 1);
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * Animate
   */
  const clock = new THREE.Clock();

  const animate = () => {
    //時間取得
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;

    controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(animate);
  };

  animate();
}
