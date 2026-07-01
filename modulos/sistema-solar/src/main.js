// modulos/sistema-solar/src/main.js

import { Engine } from '../../../src/core/Engine.js';
import { SistemaSolar } from './SistemaSolar.js';
import { ModalManager } from '../../../src/ui/ModalManager.js';

console.log('🚀 Iniciando main.js');

const engine = new Engine();
const sistemaSolar = new SistemaSolar();

let ultimoPlanetaClickeado = null;

engine.cargarModulo(sistemaSolar);

// ─── Sobrescribir onObjectClick para guardar el planeta ───
const originalOnObjectClick = sistemaSolar.onObjectClick.bind(sistemaSolar);
sistemaSolar.onObjectClick = function(objeto) {
    console.log('📞 onObjectClick llamado para:', objeto.userData?.nombre);
    ultimoPlanetaClickeado = objeto;
    originalOnObjectClick(objeto);
};

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

// ─── 🔥 LOOP: YA NO SOBRESCRIBIMOS engine._loop ───
// El Engine ya tiene su propio loop con la lógica del zoom.
// No necesitamos hacer nada aquí.

console.log('🚀 Sistema Solar iniciado');