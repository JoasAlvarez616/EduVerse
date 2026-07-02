// modulos/ciencias/celulas/src/entorno.js

import * as THREE from 'three';

// ═══════════════════════════════════════════════════════
// 🎨 TEXTURA NÚCLEO - MÁS VOLUMEN, DEGRADADO MÁS MARCADO
// ═══════════════════════════════════════════════════════

export function crearTexturaNucleo() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Fondo con degradado radial más marcado
    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 270);
    grad.addColorStop(0, '#fce0f0');
    grad.addColorStop(0.35, '#f5b8d8');
    grad.addColorStop(0.7, '#e890c0');
    grad.addColorStop(1, '#c06090');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Sombras internas (anillos concéntricos sutiles)
    for (let i = 0; i < 5; i++) {
        const r = 80 + i * 45;
        const g = ctx.createRadialGradient(256, 256, r - 10, 256, 256, r + 10);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(0.5, 'rgba(180, 80, 130, 0.12)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 512, 512);
    }

    // Cromatina difusa
    for (let i = 0; i < 70; i++) {
        const x = 60 + Math.random() * 392;
        const y = 60 + Math.random() * 392;
        const r = 8 + Math.random() * 30;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(200, 90, 150, 0.3)');
        g.addColorStop(1, 'rgba(200, 90, 150, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Puntos de cromatina
    for (let i = 0; i < 350; i++) {
        const x = Math.random() * 512, y = Math.random() * 512;
        ctx.beginPath();
        ctx.arc(x, y, 0.4 + Math.random() * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(170, 70, 120, ${0.12 + Math.random() * 0.25})`;
        ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
}

// ═══════════════════════════════════════════════════════
// 🎨 TEXTURA ENVOLTURA NUCLEAR
// ═══════════════════════════════════════════════════════

export function crearTexturaEnvoltura() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 512, 512);

    // Doble anillo concéntrico
    const grad = ctx.createRadialGradient(256, 256, 220, 256, 256, 270);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.4, 'rgba(150, 60, 110, 0.3)');
    grad.addColorStop(0.6, 'rgba(150, 60, 110, 0.5)');
    grad.addColorStop(0.8, 'rgba(130, 40, 90, 0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Segundo anillo (exterior)
    const grad2 = ctx.createRadialGradient(256, 256, 235, 256, 256, 280);
    grad2.addColorStop(0, 'rgba(0,0,0,0)');
    grad2.addColorStop(0.5, 'rgba(160, 70, 120, 0.2)');
    grad2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, 512, 512);

    return new THREE.CanvasTexture(canvas);
}

// ═══════════════════════════════════════════════════════
// 🎨 TEXTURA NUCLÉOLO - MÁS BRILLANTE
// ═══════════════════════════════════════════════════════

export function crearTexturaNucleolo() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 5, 128, 128, 130);
    grad.addColorStop(0, '#ff7070');
    grad.addColorStop(0.25, '#ff5050');
    grad.addColorStop(0.6, '#e03030');
    grad.addColorStop(0.9, '#a01020');
    grad.addColorStop(1, '#600810');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Puntos brillantes
    for (let i = 0; i < 250; i++) {
        const x = Math.random() * 256, y = Math.random() * 256;
        if (Math.sqrt((x-128)**2 + (y-128)**2) < 115) {
            ctx.beginPath();
            ctx.arc(x, y, 0.4 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 180, ${0.2 + Math.random() * 0.45})`;
            ctx.fill();
        }
    }

    return new THREE.CanvasTexture(canvas);
}

// ═══════════════════════════════════════════════════════
// 🎨 TEXTURA CITOPLASMA - GEL CON MÁS PROFUNDIDAD
// ═══════════════════════════════════════════════════════

export function crearTexturaCitoplasma() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Fondo celeste suave
    ctx.fillStyle = '#dfeaf5';
    ctx.fillRect(0, 0, 1024, 1024);

    // Gradiente radial
    const grad = ctx.createRadialGradient(512, 512, 40, 512, 512, 680);
    grad.addColorStop(0, 'rgba(220, 238, 255, 0.6)');
    grad.addColorStop(0.5, 'rgba(200, 222, 248, 0.35)');
    grad.addColorStop(1, 'rgba(170, 200, 232, 0.55)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Nubes de densidad
    for (let i = 0; i < 20; i++) {
        const x = 180 + Math.random() * 664;
        const y = 180 + Math.random() * 664;
        const r = 35 + Math.random() * 90;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(180, 210, 240, 0.2)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Micro partículas
    for (let i = 0; i < 600; i++) {
        const x = Math.random() * 1024, y = Math.random() * 1024;
        ctx.beginPath();
        ctx.arc(x, y, 0.25 + Math.random() * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 170, 200, ${0.05 + Math.random() * 0.1})`;
        ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
}

// ═══════════════════════════════════════════════════════
// 🎨 TEXTURA MITOCONDRIA - INTERIOR ROJO ONDULADO
// ═══════════════════════════════════════════════════════

export function crearTexturaMitocondria() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    // Matriz rojiza
    const grad = ctx.createRadialGradient(200, 100, 5, 200, 100, 210);
    grad.addColorStop(0, '#ffe8d0');
    grad.addColorStop(0.3, '#ffc8a0');
    grad.addColorStop(0.7, '#f09070');
    grad.addColorStop(1, '#d06040');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 200);

    // Crestas onduladas rojas
    for (let i = 0; i < 11; i++) {
        const xBase = 35 + (i / 10) * 330;
        const altura = 16 + Math.sin((i / 10) * Math.PI) * 50;

        ctx.beginPath();
        ctx.moveTo(xBase, 100 - altura/2);
        for (let j = 1; j <= 7; j++) {
            const py = 100 - altura/2 + (j / 7) * altura;
            const px = xBase + Math.sin(j * 2.2) * 5;
            ctx.lineTo(px, py);
        }
        ctx.strokeStyle = 'rgba(200, 50, 40, 0.6)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Brillo encima
        ctx.beginPath();
        ctx.moveTo(xBase + 2, 100 - altura/2 + 2);
        for (let j = 1; j <= 7; j++) {
            const py = 100 - altura/2 + (j / 7) * altura;
            const px = xBase + 2 + Math.sin(j * 2.2 + 0.6) * 3;
            ctx.lineTo(px, py);
        }
        ctx.strokeStyle = 'rgba(255, 140, 100, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    // Granulación
    for (let i = 0; i < 350; i++) {
        const x = Math.random() * 400, y = Math.random() * 200;
        ctx.beginPath();
        ctx.arc(x, y, 0.3 + Math.random() * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 120, 90, ${0.06 + Math.random() * 0.14})`;
        ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
}

// ═══════════════════════════════════════════════════════
// 🎨 TEXTURA GOLGI - CAPAS APILADAS (SIN CAMBIOS MAYORES)
// ═══════════════════════════════════════════════════════

export function crearTexturaGolgi() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 256, 256);

    for (let i = 0; i < 7; i++) {
        const y = 40 + i * 26;
        ctx.beginPath();
        ctx.moveTo(25, y + 4);
        ctx.bezierCurveTo(85, y - 2, 175, y + 14, 231, y + 4);
        ctx.strokeStyle = 'rgba(200, 140, 60, 0.2)';
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(25, y);
        ctx.bezierCurveTo(85, y - 8, 175, y + 10, 231, y);
        ctx.strokeStyle = '#f7b955';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(25, y + 5);
        ctx.bezierCurveTo(85, y - 3, 175, y + 15, 231, y + 5);
        ctx.strokeStyle = '#e3912d';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    for (let i = 0; i < 10; i++) {
        const lado = Math.random() > 0.5 ? 0 : 1;
        const x = lado === 0 ? 15 + Math.random() * 20 : 216 + Math.random() * 20;
        const y = 35 + Math.random() * 186;
        ctx.beginPath();
        ctx.arc(x, y, 3 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd278';
        ctx.fill();
        ctx.strokeStyle = '#e3912d';
        ctx.lineWidth = 0.8;
        ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
}

// ═══════════════════════════════════════════════════════
// 🎨 TEXTURA LISOSOMA - GALLETA CON CHISPAS
// ═══════════════════════════════════════════════════════

export function crearTexturaLisosoma() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Base galleta
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 66);
    grad.addColorStop(0, '#ffe0a0');
    grad.addColorStop(0.4, '#ffc060');
    grad.addColorStop(0.8, '#f09030');
    grad.addColorStop(1, '#c06018');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    // Chispas (puntitos oscuros)
    for (let i = 0; i < 35; i++) {
        const x = Math.random() * 128, y = Math.random() * 128;
        if (Math.sqrt((x-64)**2 + (y-64)**2) < 58) {
            ctx.beginPath();
            ctx.arc(x, y, 0.8 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(140, 60, 70, ${0.4 + Math.random() * 0.5})`;
            ctx.fill();
        }
    }

    // Manchas enzimáticas
    for (let i = 0; i < 6; i++) {
        const x = 35 + Math.random() * 58, y = 35 + Math.random() * 58;
        const r = 5 + Math.random() * 10;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(255, 240, 180, 0.5)');
        g.addColorStop(1, 'rgba(255, 180, 80, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
}

// ═══════════════════════════════════════════════════════
// 🎨 TEXTURA VACUOLA - MÁS TRANSLÚCIDA
// ═══════════════════════════════════════════════════════

export function crearTexturaVacuola() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(64, 64, 3, 64, 64, 66);
    grad.addColorStop(0, 'rgba(190, 225, 250, 0.1)');
    grad.addColorStop(0.5, 'rgba(150, 200, 240, 0.2)');
    grad.addColorStop(0.8, 'rgba(90, 150, 210, 0.45)');
    grad.addColorStop(1, 'rgba(40, 100, 170, 0.7)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    // Reflejo
    const gradRef = ctx.createRadialGradient(42, 42, 0, 42, 42, 15);
    gradRef.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    gradRef.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradRef;
    ctx.beginPath();
    ctx.arc(42, 42, 15, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
}