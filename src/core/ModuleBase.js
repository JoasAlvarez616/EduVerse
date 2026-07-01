export class ModuleBase {
    constructor(config = {}) {
        this.nombre = config.nombre || 'Módulo sin nombre';
        this.datos = config.datos || [];
        this.scene = null;
        this.camera = null;
        this.controls = null;
        this.luces = [];
        this.entorno = [];
        this.isActive = false;
    }

    init() {
        console.log(`🔬 ${this.nombre} iniciado`);
        this.isActive = true;
    }

    onEnter() {
        console.log(`🚪 Entrando a ${this.nombre}`);
        this.isActive = true;
    }

    update() {}

    onExit() {
        console.log(`🚪 Saliendo de ${this.nombre}`);
        this.isActive = false;
    }

    destroy() {
        console.log(`🔄 ${this.nombre} destruido`);
        this.isActive = false;
        this.luces = [];
        this.entorno = [];
    }

    onObjectClick(objeto) {
        console.log(`🔍 Clic en: ${objeto.userData?.nombre || 'objeto sin nombre'}`);
    }

    getClickableObjects() {
        return [];
    }

    agregarLuz(luz) {
        this.luces.push(luz);
        this.scene.add(luz);
        return luz;
    }

    agregarEntorno(mesh) {
        this.entorno.push(mesh);
        this.scene.add(mesh);
        return mesh;
    }
}