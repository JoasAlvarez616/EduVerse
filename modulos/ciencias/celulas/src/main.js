// modulos/ciencias/celulas/src/main.js

import { Engine } from '../../../../src/core/Engine.js';
import { Celulas } from './Celulas.js';
import { ModalManager } from '../../../../src/ui/ModalManager.js';

console.log('🧬 Iniciando módulo de Biología Celular');

const engine = new Engine();
const celulas = new Celulas();

// Iniciar directamente el módulo (sin portal)
const experiencia = document.getElementById('experiencia-3d');
if (experiencia) experiencia.classList.add('visible');

engine.cargarModulo(celulas);

// Cerrar modal
document.addEventListener('DOMContentLoaded', () => {
    const btnCerrar = document.getElementById('modal-cerrar');
    const modal = document.getElementById('modal-info');

    function cerrarModal() {
        ModalManager.cerrar();
        // La cámara ya está en posición fija, no necesitamos restaurar zoom
    }

    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }
});

console.log('✅ Módulo de Células listo');