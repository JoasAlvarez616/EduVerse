// modulos/sistema-solar/src/main.js

import { Engine } from '../../../../src/core/Engine.js';
import { SistemaSolar } from './SistemaSolar.js';
import { ModalManager } from '../../../../src/ui/ModalManager.js';

console.log('🚀 Iniciando main.js');

const engine = new Engine();
const sistemaSolar = new SistemaSolar();

let ultimoPlanetaClickeado = null;

// ─── Portal de lanzamiento ───
const portal = document.getElementById('portal-lanzamiento');
const btnLanzamiento = document.getElementById('btn-lanzamiento');
const experiencia = document.getElementById('experiencia-3d');

console.log('🔍 Portal:', portal);
console.log('🔍 Botón:', btnLanzamiento);
console.log('🔍 Experiencia:', experiencia);

// ─── Función para iniciar el Sistema Solar ───
function iniciarSistemaSolar() {
    console.log('🚀 Iniciando Sistema Solar');

    // 1. Ocultar portal
    if (portal) portal.classList.add('oculto');

    // 2. Mostrar experiencia 3D
    if (experiencia) experiencia.classList.add('visible');

    // 3. Iniciar el motor con el Sistema Solar
    engine.cargarModulo(sistemaSolar);

    // 4. Guardar referencia para cerrar modal
    const originalOnObjectClick = sistemaSolar.onObjectClick.bind(sistemaSolar);
    sistemaSolar.onObjectClick = function(objeto) {
        ultimoPlanetaClickeado = objeto;
        originalOnObjectClick(objeto);
    };

    console.log('✅ Sistema Solar iniciado');
}

// ─── Evento del botón ───
if (btnLanzamiento) {
    btnLanzamiento.addEventListener('click', iniciarSistemaSolar);
    console.log('✅ Botón de lanzamiento configurado');
} else {
    console.warn('⚠️ Botón de lanzamiento no encontrado');
    // Fallback: si no hay botón, iniciar directamente
    iniciarSistemaSolar();
}

// ─── Tooltip flotante ───
const tooltip = document.createElement('div');
tooltip.id = 'tooltip-planeta';
tooltip.style.cssText = `
    position: fixed;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(6px);
    color: white;
    padding: 4px 14px;
    border-radius: 12px;
    font-family: 'Fredoka', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.5px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    border: 1px solid rgba(255,255,255,0.08);
    z-index: 100;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
`;
document.body.appendChild(tooltip);

let posX = 0, posY = 0;

// ─── Hover callback ───
engine.setHoverCallback((nombre, event) => {
    if (nombre) {
        tooltip.textContent = nombre;
        tooltip.style.opacity = '1';
        document.body.style.cursor = 'pointer';
        if (event) {
            posX = event.clientX;
            posY = event.clientY;
            tooltip.style.left = (posX + 15) + 'px';
            tooltip.style.top = (posY - 10) + 'px';
        }
    } else {
        tooltip.style.opacity = '0';
        document.body.style.cursor = 'default';
    }
});

document.addEventListener('pointermove', (e) => {
    posX = e.clientX;
    posY = e.clientY;
    if (tooltip.style.opacity === '1') {
        tooltip.style.left = (posX + 15) + 'px';
        tooltip.style.top = (posY - 10) + 'px';
    }
});

// ─── Cerrar modal ───
document.addEventListener('DOMContentLoaded', () => {
    const btnCerrar = document.getElementById('modal-cerrar');
    const modal = document.getElementById('modal-info');

    function cerrarModalYRestaurar() {
        console.log('❌ Cerrando modal y restaurando');
        ModalManager.cerrar();
        if (ultimoPlanetaClickeado) {
            engine.reanudarPlaneta(ultimoPlanetaClickeado);
            ultimoPlanetaClickeado = null;
        }
        engine.restaurarZoom();
    }

    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarModalYRestaurar);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModalYRestaurar();
            }
        });
    }
});

// ─── ❌ ELIMINADO: NO sobrescribir engine._loop ───
// El Engine ya tiene su propio loop con el zoom y la animación.

// ─── Controles de velocidad ───
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowUp') {
        if (sistemaSolar.timeScale !== undefined) {
            sistemaSolar.timeScale = Math.min((sistemaSolar.timeScale || 1) + 0.1, 2);
            console.log(`⏩ Velocidad: ${sistemaSolar.timeScale.toFixed(1)}x`);
        }
    }
    if (e.key === 'ArrowDown') {
        if (sistemaSolar.timeScale !== undefined) {
            sistemaSolar.timeScale = Math.max((sistemaSolar.timeScale || 1) - 0.1, 0.1);
            console.log(`⏪ Velocidad: ${sistemaSolar.timeScale.toFixed(1)}x`);
        }
    }
    if (e.key === ' ') {
        e.preventDefault();
        if (sistemaSolar.timeScale !== undefined) {
            sistemaSolar.timeScale = sistemaSolar.timeScale === 0 ? 1 : 0;
            console.log(`⏸️ ${sistemaSolar.timeScale === 0 ? 'Pausado' : 'Reanudado'}`);
        }
    }
});

console.log('🚀 Portal de lanzamiento listo');