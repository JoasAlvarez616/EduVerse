// src/core/Engine.js

import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';

export class Engine {
    constructor() {
        this.sceneManager = new SceneManager();
        this.moduloActual = null;
        this.isRunning = false;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.objetoHover = null;
        this.onHover = null;

        // ─── Zoom ───
        this.zoomObjetivo = null;
        this.zoomAnimando = false;
        this.zoomInicio = null;
        this.zoomFin = null;
        this.zoomProgreso = 0;
        this.zoomCallback = null;

        this._bindEvents();
        console.log('⚙️ Engine inicializado');
    }

    get scene() { return this.sceneManager.scene; }
    get camera() { return this.sceneManager.camera; }
    get controls() { return this.sceneManager.controls; }

    setHoverCallback(callback) {
        this.onHover = callback;
    }

    cargarModulo(modulo) {
        if (this.moduloActual) {
            this.moduloActual.onExit();
            this.moduloActual.destroy();
        }

        this.moduloActual = modulo;
        modulo.scene = this.scene;
        modulo.camera = this.camera;
        modulo.controls = this.controls;

        modulo.init();
        modulo.onEnter();

        if (!this.isRunning) {
            this.isRunning = true;
            this._loop();
        }
    }

    // ─── Zoom ───
    zoomAObjeto(objeto, callback = null) {
        if (this.zoomAnimando) return;

        this.zoomObjetivo = objeto;
        this.zoomAnimando = true;
        this.zoomProgreso = 0;
        this.zoomCallback = callback;

        this.zoomInicio = this.camera.position.clone();

        const distancia = objeto.userData?.tamano || 1;
        const offset = new THREE.Vector3(0, distancia * 0.8, distancia * 3.5);
        this.zoomFin = objeto.position.clone().add(offset);

        objeto.userData._pausado = true;
        console.log('✅ Planeta pausado:', objeto.userData?.nombre);
    }

    restaurarZoom() {
        this.zoomObjetivo = null;
        this.zoomAnimando = false;
        this.zoomProgreso = 0;

        this.camera.position.set(18, 12, 35);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        console.log('🔄 Zoom restaurado');
    }

    reanudarPlaneta(objeto) {
        if (objeto) {
            objeto.userData._pausado = false;
            console.log('▶️ Planeta reanudado:', objeto.userData?.nombre);
        }
    }

    // ─── Loop principal ───
    _loop() {
        if (!this.isRunning) return;
        requestAnimationFrame(() => this._loop());

        // Animación de zoom
        if (this.zoomAnimando && this.zoomObjetivo) {
            this.zoomProgreso += 0.035;
            if (this.zoomProgreso >= 1) {
                this.zoomProgreso = 1;
                this.zoomAnimando = false;
                if (this.zoomCallback) {
                    this.zoomCallback();
                    this.zoomCallback = null;
                }
            }

            const t = this.zoomProgreso < 0.5
                ? 2 * this.zoomProgreso * this.zoomProgreso
                : 1 - Math.pow(-2 * this.zoomProgreso + 2, 2) / 2;

            this.camera.position.lerpVectors(this.zoomInicio, this.zoomFin, t);
            this.controls.target.lerp(this.zoomObjetivo.position, t * 0.7);
            this.controls.update();
        }

        if (this.moduloActual?.update) {
            this.moduloActual.update();
        }

        this.sceneManager.render();
    }

    // ─── Click ───
    _handlePointerDown(event) {
        if (!this.moduloActual) return;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const objetos = this.moduloActual.getClickableObjects?.() || [];
        const intersecciones = this.raycaster.intersectObjects(objetos, true);

        if (intersecciones.length > 0) {
            let objeto = intersecciones[0].object;
            while (objeto && !objeto.userData?.nombre) {
                objeto = objeto.parent;
            }
            if (objeto && objeto.userData?.nombre) {
                this.zoomAObjeto(objeto, () => {
                    this.moduloActual.onObjectClick?.(objeto);
                });
            }
        }
    }

    // ─── Hover ───
    _handlePointerMove(event) {
        if (!this.moduloActual) return;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const objetos = this.moduloActual.getClickableObjects?.() || [];
        const intersecciones = this.raycaster.intersectObjects(objetos, true);

        let nuevoHover = null;
        let nombre = null;
        if (intersecciones.length > 0) {
            let objeto = intersecciones[0].object;
            while (objeto && !objeto.userData?.nombre) {
                objeto = objeto.parent;
            }
            if (objeto && objeto.userData?.nombre) {
                nuevoHover = objeto;
                nombre = objeto.userData.nombre;
            }
        }

        this.objetoHover = nuevoHover;

        if (this.onHover) {
            this.onHover(nombre, event);
        }
    }

    // ─── Eventos ───
    _bindEvents() {
        window.addEventListener('pointerdown', (e) => this._handlePointerDown(e));
        window.addEventListener('pointermove', (e) => this._handlePointerMove(e));
        // Click como fallback para compatibilidad
        window.addEventListener('click', (e) => this._handlePointerDown(e));
    }
}