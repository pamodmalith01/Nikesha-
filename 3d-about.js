
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js?min';

const container = document.getElementById('canvas-container-about');

if (!container) {
    console.error("3D Container not found!");
} else {
    // Scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background

    // Camera
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    // --- Create a Floating Crystal / Gemstone Effect ---
    const gemGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    const gemMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xD4AF37, // Gold
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.6, // Glass-like
        opacity: 0.8,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        ior: 1.5,
    });

    const gem = new THREE.Mesh(gemGeometry, gemMaterial);
    scene.add(gem);

    // Inner Core (to make it look more solid/magical)
    const coreGeometry = new THREE.IcosahedronGeometry(0.8, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        emissive: 0x0DA633,
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 1.0
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    gem.add(core);

    // Orbiting Rings
    const ringGeometry = new THREE.TorusGeometry(2.2, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.5 });

    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    const ring2 = ring1.clone();
    const ring3 = ring1.clone();

    ring1.rotation.x = Math.PI / 2;
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    ring3.rotation.x = -Math.PI / 3;
    ring3.rotation.y = -Math.PI / 6;

    scene.add(ring1);
    scene.add(ring2);
    scene.add(ring3);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 8;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xD4AF37,
        transparent: true,
        opacity: 0.6,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(2, 5, 2);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xD4AF37, 2, 10);
    pointLight.position.set(-2, 1, 3);
    scene.add(pointLight);

    // Animation
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Rotate Gem
        gem.rotation.y = time * 0.2;
        gem.rotation.z = time * 0.1;

        // Rotate Rings
        ring1.rotation.z = time * 0.2;
        ring2.rotation.z = time * 0.15;
        ring3.rotation.z = time * 0.25;

        // Float
        gem.position.y = Math.sin(time * 0.5) * 0.1;

        // Particles
        particlesMesh.rotation.y = time * 0.05;

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
}
