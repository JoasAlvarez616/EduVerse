// src/ui/ModalManager.js

export class ModalManager {
    static mostrar({ titulo, descripcion, datoCurioso, imagen }) {
        const modal = document.getElementById('modal-info');
        const tituloEl = document.getElementById('modal-titulo');
        const descripcionEl = document.getElementById('modal-descripcion');
        const datoCuriosoEl = document.getElementById('modal-dato-curioso');
        const imagenEl = document.getElementById('modal-imagen');

        if (!modal) {
            console.warn('⚠️ Modal no encontrado en el DOM');
            return;
        }

        if (tituloEl) tituloEl.textContent = titulo || 'Sin título';
        if (descripcionEl) descripcionEl.textContent = descripcion || '';
        if (datoCuriosoEl) {
            datoCuriosoEl.textContent = datoCurioso ? `✨ ${datoCurioso}` : '';
        }
        if (imagenEl && imagen) {
            imagenEl.src = imagen;
            imagenEl.style.display = 'block';
        } else if (imagenEl) {
            imagenEl.style.display = 'none';
        }

        modal.classList.remove('oculto');
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
    }

    static cerrar() {
        const modal = document.getElementById('modal-info');
        if (modal) {
            modal.classList.add('oculto');
            modal.style.opacity = '0';
            modal.style.pointerEvents = 'none';
        }
    }
}