
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('canvas-container');

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xFDFBF7, 0.02);

// Camera
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 2, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;
controls.maxPolarAngle = Math.PI / 1.5;

// --- Procedural Dragon / Mascot Creation ---
const dragonGroup = new THREE.Group();
scene.add(dragonGroup);

// Materials
const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4AF37, // Gold
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x332200,
    emissiveIntensity: 0.2
});

const bellyMaterial = new THREE.MeshStandardMaterial({
    color: 0xFDFBF7, // Cream
    metalness: 0.3,
    roughness: 0.5
});

const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00FFBB }); // Glowing Cyan Eyes

// Body (Serpentine shape using multiple spheres)
const bodySegments = 15;
for (let i = 0; i < bodySegments; i++) {
    const scale = 1 - (i / bodySegments) * 0.8;
    const geometry = new THREE.SphereGeometry(0.5 * scale, 32, 32);
    const mesh = new THREE.Mesh(geometry, skinMaterial);

    // Initial position in a sine wave pattern
    mesh.position.set(
        Math.sin(i * 0.5) * 1.5,
        Math.cos(i * 0.3) * 1.0 - (i * 0.2),
        Math.cos(i * 0.5) * 1.5
    );

    mesh.castShadow = true;
    mesh.userData = {
        index: i,
        basePos: mesh.position.clone(),
        speed: 2 + i * 0.1
    };
    dragonGroup.add(mesh);
}

// Head
const headGeo = new THREE.ConeGeometry(0.6, 1.2, 32);
const head = new THREE.Mesh(headGeo, skinMaterial);
head.rotation.x = -Math.PI / 2;
head.position.set(0, 1.2, 2);
head.castShadow = true;
dragonGroup.add(head);

// Eyes
const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
leftEye.position.set(0.25, 1.4, 2.2);
dragonGroup.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
rightEye.position.set(-0.25, 1.4, 2.2);
dragonGroup.add(rightEye);

// Wings (Abstract)
const wingShape = new THREE.Shape();
wingShape.moveTo(0, 0);
wingShape.quadraticCurveTo(2, 2, 4, 0);
wingShape.quadraticCurveTo(2, -1, 0, 0);

const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.1, bevelEnabled: false });
const wingMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
});

const leftWing = new THREE.Mesh(wingGeo, wingMat);
leftWing.position.set(0.5, 0.5, 0.5);
leftWing.rotation.z = -Math.PI / 4;
leftWing.rotation.y = Math.PI / 4;
leftWing.scale.set(0.5, 0.5, 0.5);
dragonGroup.add(leftWing);

const rightWing = new THREE.Mesh(wingGeo, wingMat);
rightWing.position.set(-0.5, 0.5, 0.5);
rightWing.rotation.z = Math.PI / 4;
rightWing.rotation.y = -Math.PI / 4;
rightWing.scale.set(0.5, 0.5, 0.5);
dragonGroup.add(rightWing);

// Floating Particles
const particleCount = 100;
const particlesGeo = new THREE.BufferGeometry();
const particlePositions = [];
for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 10;
    const z = (Math.random() - 0.5) * 10;
    particlePositions.push(x, y, z);
}
particlesGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
const particlesMat = new THREE.PointsMaterial({
    color: 0xD4AF37,
    size: 0.05,
    transparent: true,
    opacity: 0.8
});
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);


// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(5, 10, 5);
spotLight.castShadow = true;
scene.add(spotLight);

const goldLight = new THREE.PointLight(0xD4AF37, 3, 15);
goldLight.position.set(-2, 2, 2);
scene.add(goldLight);

const blueLight = new THREE.PointLight(0x00FFFF, 1, 10);
blueLight.position.set(2, -2, 2);
scene.add(blueLight);

// Animation
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Animate Dragon Body (Undulating Motion)
    dragonGroup.children.forEach((child, idx) => {
        if (child.geometry.type === 'SphereGeometry' && child.userData.index !== undefined) {
            const i = child.userData.index;
            const offset = i * 0.2;

            child.position.x = child.userData.basePos.x + Math.sin(time * 2 + offset) * 0.2;
            child.position.y = child.userData.basePos.y + Math.cos(time * 1.5 + offset) * 0.2;
        }
    });

    // Float entire group
    dragonGroup.position.y = Math.sin(time * 0.5) * 0.5;

    // Wing flap
    leftWing.rotation.z = -Math.PI / 4 + Math.sin(time * 5) * 0.1;
    rightWing.rotation.z = Math.PI / 4 - Math.sin(time * 5) * 0.1;

    // Particle rotation
    particles.rotation.y = time * 0.05;

    controls.update();
    renderer.render(scene, camera);
}

// Resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

animate();
