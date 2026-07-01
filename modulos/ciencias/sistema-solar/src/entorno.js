// modulos/sistema-solar/src/entorno.js

import * as THREE from 'three';

export function crearIluminacion(scene) {
    const ambiente = new THREE.AmbientLight(0x334466, 0.35);
    scene.add(ambiente);

    const direccional = new THREE.DirectionalLight(0xffeedd, 1.2);
    direccional.position.set(30, 20, 40);
    scene.add(direccional);

    const relleno = new THREE.DirectionalLight(0x4466ff, 0.25);
    relleno.position.set(-30, 10, -40);
    scene.add(relleno);

    return [ambiente, direccional, relleno];
}

export function crearFondoEstrellas(scene) {
    const esMovil = window.innerWidth < 768 || window.innerHeight < 768;
    const cantidad = esMovil ? 2500 : 7000;

    const geometria = new THREE.BufferGeometry();
    const posiciones = new Float32Array(cantidad * 3);
    const colores = new Float32Array(cantidad * 3);
    const tamanos = new Float32Array(cantidad);

    const paleta = [
        new THREE.Color(0xffffff),
        new THREE.Color(0xaaccff),
        new THREE.Color(0xffddbb),
        new THREE.Color(0xccddff),
        new THREE.Color(0xffccaa),
        new THREE.Color(0xddddff),
        new THREE.Color(0xffffcc),
        new THREE.Color(0xffaacc),
        new THREE.Color(0xaaffcc)
    ];

    for (let i = 0; i < cantidad; i++) {
        const radio = 100 + Math.random() * 300;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const idx = i * 3;
        posiciones[idx] = radio * Math.sin(phi) * Math.cos(theta);
        posiciones[idx + 1] = radio * Math.sin(phi) * Math.sin(theta);
        posiciones[idx + 2] = radio * Math.cos(phi);

        const color = paleta[Math.floor(Math.random() * paleta.length)];
        const brillo = 0.7 + Math.random() * 0.6;
        colores[idx] = color.r * brillo;
        colores[idx + 1] = color.g * brillo;
        colores[idx + 2] = color.b * brillo;

        tamanos[i] = 0.3 + Math.random() * 3.0;
    }

    geometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
    geometria.setAttribute('color', new THREE.BufferAttribute(colores, 3));
    geometria.setAttribute('size', new THREE.BufferAttribute(tamanos, 1));

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.1, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texturaEstrella = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        size: 2.0,
        map: texturaEstrella,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });

    const estrellas = new THREE.Points(geometria, material);
    scene.add(estrellas);
    return estrellas;
}

export function crearNebulosa(scene) {
    const cantidad = 1200;
    const geometria = new THREE.BufferGeometry();
    const posiciones = new Float32Array(cantidad * 3);
    const colores = new Float32Array(cantidad * 3);

    const paleta = [
        new THREE.Color(0x4a1a6b),
        new THREE.Color(0x1a3a6b),
        new THREE.Color(0x6b1a3a),
        new THREE.Color(0x1a6b4a)
    ];

    for (let i = 0; i < cantidad; i++) {
        const radio = 80 + Math.random() * 120;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const idx = i * 3;
        posiciones[idx] = radio * Math.sin(phi) * Math.cos(theta);
        posiciones[idx + 1] = radio * Math.sin(phi) * Math.sin(theta) * 0.3;
        posiciones[idx + 2] = radio * Math.cos(phi);

        const color = paleta[Math.floor(Math.random() * paleta.length)];
        const intensidad = 0.12 + Math.random() * 0.12;
        colores[idx] = color.r * intensidad;
        colores[idx + 1] = color.g * intensidad;
        colores[idx + 2] = color.b * intensidad;
    }

    geometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
    geometria.setAttribute('color', new THREE.BufferAttribute(colores, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texturaNube = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        size: 7.0,
        map: texturaNube,
        vertexColors: true,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });

    const nebulosa = new THREE.Points(geometria, material);
    scene.add(nebulosa);
    return nebulosa;
}

// ☀️ Resplandor del sol
export function crearResplandorSol() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 230, 200, 1.0)');
    grad.addColorStop(0.1, 'rgba(255, 210, 170, 0.8)');
    grad.addColorStop(0.3, 'rgba(255, 180, 130, 0.4)');
    grad.addColorStop(0.6, 'rgba(255, 140, 80, 0.15)');
    grad.addColorStop(1, 'rgba(255, 100, 40, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
}