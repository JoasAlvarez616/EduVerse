// modulos/sistema-solar/src/SistemaSolar.js

import * as THREE from 'three';
import { ModuleBase } from '../../../src/core/ModuleBase.js';
import { ModalManager } from '../../../src/ui/ModalManager.js';
import { crearIluminacion, crearFondoEstrellas, crearNebulosa } from './entorno.js';
import { DATOS_PLANETAS } from './datos.js';

// ───────────────────────────────────────────────
// 🎨 ANILLOS DE SATURNO (PROCEDURALES)
// ───────────────────────────────────────────────

function crearTexturaAnillosCompacta() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radioMax = canvas.width / 2;

    const bandas = [
        { radio: 0.14, color: 'rgba(180, 160, 140, 0.4)', grosor: 6 },
        { radio: 0.17, color: 'rgba(220, 200, 180, 0.8)', grosor: 10 },
        { radio: 0.20, color: 'rgba(190, 170, 150, 0.5)', grosor: 8 },
        { radio: 0.23, color: 'rgba(240, 220, 200, 0.9)', grosor: 12 },
        { radio: 0.27, color: 'rgba(160, 140, 120, 0.4)', grosor: 6 },
        { radio: 0.30, color: 'rgba(230, 210, 190, 0.85)', grosor: 10 },
        { radio: 0.34, color: 'rgba(180, 160, 140, 0.5)', grosor: 8 },
        { radio: 0.37, color: 'rgba(250, 230, 210, 0.9)', grosor: 14 },
        { radio: 0.41, color: 'rgba(150, 130, 110, 0.3)', grosor: 6 },
        { radio: 0.44, color: 'rgba(220, 200, 180, 0.8)', grosor: 10 },
        { radio: 0.48, color: 'rgba(170, 150, 130, 0.4)', grosor: 6 },
        { radio: 0.51, color: 'rgba(240, 220, 200, 0.85)', grosor: 12 },
        { radio: 0.55, color: 'rgba(140, 120, 100, 0.3)', grosor: 6 },
        { radio: 0.58, color: 'rgba(230, 210, 190, 0.75)', grosor: 10 },
        { radio: 0.62, color: 'rgba(190, 170, 150, 0.5)', grosor: 8 },
        { radio: 0.65, color: 'rgba(250, 230, 210, 0.8)', grosor: 12 },
        { radio: 0.69, color: 'rgba(160, 140, 120, 0.3)', grosor: 6 },
        { radio: 0.72, color: 'rgba(220, 200, 180, 0.7)', grosor: 10 },
        { radio: 0.76, color: 'rgba(180, 160, 140, 0.4)', grosor: 8 },
        { radio: 0.79, color: 'rgba(240, 220, 200, 0.7)', grosor: 12 },
        { radio: 0.83, color: 'rgba(150, 130, 110, 0.25)', grosor: 6 },
        { radio: 0.86, color: 'rgba(210, 190, 170, 0.5)', grosor: 10 },
        { radio: 0.90, color: 'rgba(170, 150, 130, 0.3)', grosor: 8 },
        { radio: 0.93, color: 'rgba(230, 210, 190, 0.4)', grosor: 10 }
    ];

    bandas.forEach((b) => {
        const r = b.radio * radioMax;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = b.color;
        ctx.lineWidth = b.grosor;
        ctx.stroke();
    });

    for (let i = 0; i < 200; i++) {
        const radio = 0.12 + Math.random() * 0.80;
        const r = radio * radioMax;
        const grosor = 0.5 + Math.random() * 2.5;
        const alpha = 0.05 + Math.random() * 0.3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 240, 220, ${alpha})`;
        ctx.lineWidth = grosor;
        ctx.stroke();
    }

    for (let i = 0; i < 8000; i++) {
        const ang = Math.random() * Math.PI * 2;
        const rad = 0.1 + Math.random() * 0.85;
        const r = rad * radioMax;
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r;
        const size = 1 + Math.random() * 2;
        const alpha = Math.random() * 0.04;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(x, y, size, size);
    }

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radioMax);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.1, 'rgba(255, 255, 255, 0.01)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.04)');
    grad.addColorStop(0.9, 'rgba(255, 255, 255, 0.02)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function crearMascaraAnilloCompacta() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radioExt = canvas.width / 2;
    const radioInt = radioExt * 0.28;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createRadialGradient(cx, cy, radioInt * 0.5, cx, cy, radioExt * 1.02);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.06, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.10, 'rgba(0, 0, 0, 0.1)');
    grad.addColorStop(0.15, 'rgba(255, 255, 255, 0.4)');
    grad.addColorStop(0.22, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.30, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.75, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.88, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(0.95, 'rgba(255, 255, 255, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// ───────────────────────────────────────────────
// 🌞 SISTEMA SOLAR (VERSIÓN MÍNIMA)
// ───────────────────────────────────────────────

export class SistemaSolar extends ModuleBase {
    constructor() {
        super({ nombre: 'Sistema Solar' });
        this.planetas = [];
        this.sol = null;
        this.timeScale = 1;
        this.textureLoader = new THREE.TextureLoader();
    }

    init() {
        super.init();

        const luces = crearIluminacion(this.scene);
        luces.forEach(luz => this.agregarLuz(luz));

        const estrellas = crearFondoEstrellas(this.scene);
        this.agregarEntorno(estrellas);

        const nebulosa = crearNebulosa(this.scene);
        this.agregarEntorno(nebulosa);

        this._crearSol();

        DATOS_PLANETAS.forEach(data => {
            this._crearOrbita(data);
            this._crearPlaneta(data);
        });

        console.log('🌞 Sistema Solar listo');
    }

    _crearSol() {
        const geometria = new THREE.SphereGeometry(3, 48, 48);
        let material;

        try {
            const textura = this.textureLoader.load('/assets/texturas/sol.jpg');
            material = new THREE.MeshBasicMaterial({ map: textura });
        } catch (e) {
            material = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
        }

        this.sol = new THREE.Mesh(geometria, material);
        this.sol.castShadow = false;
        this.sol.receiveShadow = false;
        this.sol.renderOrder = 1;
        this.sol.userData = {
            nombre: 'Sol',
            descripcion: 'El Sol es una estrella que da luz y calor al sistema solar.',
            datoCurioso: 'El Sol contiene el 99.86% de toda la masa del sistema solar.'
        };
        this.agregarEntorno(this.sol);

        const luzSol = new THREE.PointLight(0xffeedd, 2.0, 300);
        luzSol.position.set(0, 0, 0);
        this.agregarLuz(luzSol);
    }

    _crearOrbita(data) {
        const puntos = [];
        const segmentos = 48;
        for (let i = 0; i <= segmentos; i++) {
            const angulo = (i / segmentos) * Math.PI * 2;
            puntos.push(new THREE.Vector3(
                Math.cos(angulo) * data.distancia,
                0,
                Math.sin(angulo) * data.distancia
            ));
        }
        const geometria = new THREE.BufferGeometry().setFromPoints(puntos);
        const material = new THREE.LineBasicMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.03,
            depthWrite: false,
        });
        const orbita = new THREE.Line(geometria, material);
        orbita.renderOrder = -1;
        this.agregarEntorno(orbita);
    }

    _crearPlaneta(data) {
        const geometria = new THREE.SphereGeometry(data.tamano, 32, 32);
        let material;

        if (data.textura) {
            try {
                const textura = this.textureLoader.load(data.textura);
                material = new THREE.MeshStandardMaterial({
                    map: textura,
                    roughness: 0.6,
                    metalness: 0.05,
                    depthWrite: true,
                    depthTest: true
                });
            } catch (e) {
                material = new THREE.MeshStandardMaterial({
                    color: data.color,
                    depthWrite: true,
                    depthTest: true
                });
            }
        } else {
            material = new THREE.MeshStandardMaterial({
                color: data.color,
                depthWrite: true,
                depthTest: true
            });
        }

        const mesh = new THREE.Mesh(geometria, material);
        mesh.renderOrder = 2;
        mesh.depthTest = true;
        mesh.depthWrite = true;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const angulo = Math.random() * Math.PI * 2;
        mesh.position.x = Math.cos(angulo) * data.distancia;
        mesh.position.z = Math.sin(angulo) * data.distancia;

        mesh.userData = {
            id: data.id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            datoCurioso: data.datoCurioso,
            distancia: data.distancia,
            velocidad: data.velocidad,
            angulo: angulo,
            anillos: []
        };

        if (data.id === 'saturno') {
            this._crearAnillosSaturno(mesh, data);
        }

        this.agregarEntorno(mesh);
        this.planetas.push(mesh);
    }

    _crearAnillosSaturno(planetaMesh, data) {
        const texturaAnillos = crearTexturaAnillosCompacta();
        const texturaMascara = crearMascaraAnilloCompacta();

        const anilloGeom = new THREE.PlaneGeometry(data.tamano * 4.0, data.tamano * 4.0);
        const anilloMat = new THREE.MeshBasicMaterial({
            map: texturaAnillos,
            alphaMap: texturaMascara,
            transparent: true,
            alphaTest: 0.01,
            side: THREE.DoubleSide,
            depthWrite: false,
            depthTest: true,
            opacity: 0.85,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1
        });

        const anilloMesh = new THREE.Mesh(anilloGeom, anilloMat);
        anilloMesh.rotation.x = Math.PI / 5.2;
        anilloMesh.position.copy(planetaMesh.position);
        anilloMesh.renderOrder = 0;
        anilloMesh.castShadow = false;
        anilloMesh.receiveShadow = false;

        this.agregarEntorno(anilloMesh);
        planetaMesh.userData.anillos = [anilloMesh];
    }

   update() {
    if (this.sol) {
        this.sol.rotation.y += 0.0008;
    }

    this.planetas.forEach(planeta => {
        // 🔥 Si el planeta está pausado, solo rota sobre sí mismo
        if (planeta.userData._pausado) {
            planeta.rotation.y += 0.005;
            return;
        }

        const data = planeta.userData;
        data.angulo += data.velocidad * this.timeScale;
        planeta.position.x = Math.cos(data.angulo) * data.distancia;
        planeta.position.z = Math.sin(data.angulo) * data.distancia;
        planeta.rotation.y += 0.01 * this.timeScale;

        if (data.anillos && data.anillos.length > 0) {
            data.anillos.forEach(anillo => {
                anillo.position.copy(planeta.position);
                anillo.rotation.z += 0.0003;
            });
        }
    });
}

   getClickableObjects() {
    const objetos = [this.sol, ...this.planetas].filter(Boolean);
    console.log('🔍 getClickableObjects devuelve:', objetos.length);
    return objetos;
}

    onObjectClick(objeto) {
        const data = objeto.userData;
        if (data?.nombre) {
            ModalManager.mostrar({
                titulo: data.nombre,
                descripcion: data.descripcion || 'Sin descripción',
                datoCurioso: data.datoCurioso || '',
                imagen: data.imagen || null
            });
        }
    }

    destroy() {
        this.planetas = [];
        this.sol = null;
        this.textureLoader = null;
        super.destroy();
    }
}