import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
    constructor(config = {}) {
        const {
            containerId = 'canvas-container',
            camera = {
                fov: 50,
                near: 0.1,
                far: 500,
                position: [18, 12, 35]
            },
            background = 0x050510
        } = config;

        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`❌ Contenedor #${containerId} no encontrado`);
        }

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(background);

        this.camera = new THREE.PerspectiveCamera(
            camera.fov,
            window.innerWidth / window.innerHeight,
            camera.near,
            camera.far
        );
        this.camera.position.set(camera.position[0], camera.position[1], camera.position[2]);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.maxDistance = 150;
        this.controls.minDistance = 5;
        this.controls.target.set(0, 0, 0);

        window.addEventListener('resize', () => this._handleResize());

        console.log('⚙️ SceneManager inicializado');
    }

    _handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        this.renderer.dispose();
        if (this.container.contains(this.renderer.domElement)) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}