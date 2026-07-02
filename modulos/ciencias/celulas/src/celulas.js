// modulos/ciencias/celulas/src/Celulas.js
// ═══════════════════════════════════════════════════════
// 📖 INFOGRAFÍA CIENTÍFICA v5 - VOLUMEN Y JERARQUÍA
// ═══════════════════════════════════════════════════════

import * as THREE from 'three';
import { ModuleBase } from '../../../../src/core/ModuleBase.js';
import { ModalManager } from '../../../../src/ui/ModalManager.js';
import {
    crearTexturaNucleo,
    crearTexturaNucleolo,
    crearTexturaEnvoltura,
    crearTexturaCitoplasma,
    crearTexturaMitocondria,
    crearTexturaGolgi,
    crearTexturaLisosoma,
    crearTexturaVacuola
} from './entorno.js';

export class Celulas extends ModuleBase {
    constructor() {
        super({ nombre: 'Células' });
        this.organelos = [];
        this.etiquetas = [];
        this._keydown = null;
        this.hoverId = null;
        this.modalActivo = false;
        this.svgLayer = null;
        this.etiquetasContainer = null;
        this.texturas = {};
    }

    init() {
        super.init();

        this.texturas.nucleo = crearTexturaNucleo();
        this.texturas.nucleolo = crearTexturaNucleolo();
        this.texturas.envoltura = crearTexturaEnvoltura();
        this.texturas.citoplasma = crearTexturaCitoplasma();
        this.texturas.mitocondria = crearTexturaMitocondria();
        this.texturas.golgi = crearTexturaGolgi();
        this.texturas.lisosoma = crearTexturaLisosoma();
        this.texturas.vacuola = crearTexturaVacuola();

        this.scene.background = new THREE.Color(0xdfe7ef);

        if (this.camera) {
            this.camera.position.set(0, 0.1, 8.5);
            this.camera.lookAt(0, 0, 0);
            if (this.controls) {
                this.controls.enableRotate = false;
                this.controls.enableZoom = true;
                this.controls.minDistance = 4;
                this.controls.maxDistance = 12;
                this.controls.target.set(0, 0, 0);
                this.controls.zoomSpeed = 0.8;
            }
        }

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.9));
        const luz = new THREE.DirectionalLight(0xffffff, 0.55);
        luz.position.set(4, 6, 9);
        this.scene.add(luz);

        this._crearCapaSVG();
        this._crearCapaEtiquetas();

        this._crearCitoplasma();
        this._crearMembrana();
        this._crearEnvolturaNuclear(); // ← NUEVO: orgánulo visual propio
        this._crearNucleo();
        this._crearNucleolo();
        this._crearRER();
        this._crearREL();
        this._crearGolgi();
        this._crearMitocondrias();
        this._crearLisosomas();
        this._crearPeroxisoma();
        this._crearVacuola();
        this._crearVesiculas();
        this._crearCentrosoma();
        this._crearRibosomas();

        this._registrarMembrana();
        this._crearEtiquetasYConectores();

        this._keydown = this._onKeyDown.bind(this);
        window.addEventListener('keydown', this._keydown);
        window.addEventListener('resize', () => this._actualizarConectores());

        console.log('📖 Infografía v5 - Volumen, envoltura, imperfección');
    }

    // ═══════════════════════════════════════════════════
    // UTILIDADES
    // ═══════════════════════════════════════════════════

_formaCelular(radio) {
    const s = new THREE.Shape();
    const numPts = 120; // Más puntos para suavizar
    for (let i = 0; i <= numPts; i++) {
        const a = (i / numPts) * Math.PI * 2;
        // Ondulaciones más suaves y controladas
        const def = 1 
            + Math.sin(a * 5 + 0.8) * 0.035 
            + Math.cos(a * 3 + 1.5) * 0.025 
            + Math.sin(a * 7 + 0.3) * 0.015;
        const x = Math.cos(a) * radio * def;
        const y = Math.sin(a) * radio * def;
        if (i === 0) s.moveTo(x, y);
        else s.lineTo(x, y);
    }
    // Asegurar que cierre correctamente
    s.closePath();
    return s;
}

  _formaSalchicha(t) {
    // Forma alargada tipo salchicha/chorizo
    const s = new THREE.Shape();
    const numPts = 48;
    const ancho = 0.30;  // Más estrecho
    const largo = 0.70;  // Más alargado
    
    for (let i = 0; i <= numPts; i++) {
        const a = (i / numPts) * Math.PI * 2;
        // Usar ecuación de elipse alargada
        const x = Math.cos(a) * largo * t;
        const y = Math.sin(a) * ancho * t;
        if (i === 0) s.moveTo(x, y);
        else s.lineTo(x, y);
    }
    return s;
}

    _meshCirculo(r, color, z, alpha = 1) {
        const m = new THREE.Mesh(new THREE.CircleGeometry(r, 48), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: alpha < 1, opacity: alpha }));
        m.position.z = z;
        return m;
    }

    _meshTextura(r, tex, z, alpha = 1) {
        const m = new THREE.Mesh(new THREE.CircleGeometry(r, 48), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: alpha < 1, opacity: alpha }));
        m.position.z = z;
        return m;
    }

    _meshShapeTextura(shape, tex, color, z, alpha = 1) {
        const m = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ map: tex, color, side: THREE.DoubleSide, transparent: alpha < 1, opacity: alpha }));
        m.position.z = z;
        return m;
    }

    _bordeShape(shape, color, z, alpha = 0.8) {
        const pts = shape.getPoints(60);
        const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: alpha < 1, opacity: alpha }));
        l.position.z = z;
        return l;
    }

    _registrar(grupo, id, nombre, emoji, desc, dato) {
        grupo.userData = { id, nombre, emoji, descripcion: desc, datoCurioso: dato || '' };
        grupo.children.forEach(c => c.userData = grupo.userData);
        this.agregarEntorno(grupo);
        this.organelos.push(grupo);
    }

    // ═══════════════════════════════════════════════════
    // CAPAS
    // ═══════════════════════════════════════════════════

    _crearCapaSVG() {
        this.svgLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgLayer.setAttribute('id', 'conectores-celula');
        this.svgLayer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:3;';
        document.body.appendChild(this.svgLayer);
    }

    _crearCapaEtiquetas() {
        this.etiquetasContainer = document.createElement('div');
        this.etiquetasContainer.id = 'etiquetas-celula';
        this.etiquetasContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:4;';
        document.body.appendChild(this.etiquetasContainer);
    }

    // ═══════════════════════════════════════════════════
    // ORGANELOS
    // ═══════════════════════════════════════════════════

    _crearCitoplasma() {
        const s = this._formaCelular(4.0);
        const mesh = new THREE.Mesh(new THREE.ShapeGeometry(s), new THREE.MeshBasicMaterial({ map: this.texturas.citoplasma, side: THREE.DoubleSide, transparent: true, opacity: 0.88 }));
        mesh.position.z = -0.3;
        this.agregarEntorno(mesh);
    }

    _crearMembrana() {
        const sExt = this._formaCelular(4.0);
        const sInt = this._formaCelular(3.73);

        // Doble línea de bicapa
        const ptsExt = sExt.getPoints(120);
        const geoExt = new THREE.BufferGeometry().setFromPoints(ptsExt);
        this.agregarEntorno(new THREE.Line(geoExt, new THREE.LineBasicMaterial({ color: 0x4f6fa8, linewidth: 2.5 }))).position.z = 0.03;

        const ptsInt = sInt.getPoints(120);
        const geoInt = new THREE.BufferGeometry().setFromPoints(ptsInt);
        this.agregarEntorno(new THREE.Line(geoInt, new THREE.LineBasicMaterial({ color: 0x8fb7ff, linewidth: 1.5 }))).position.z = 0.03;

        // Proteínas transmembrana insertadas
        for (let i = 0; i < 10; i++) {
            const idx = Math.floor(Math.random() * ptsExt.length);
            const pt = ptsExt[idx];
            // Pequeña proteína (cápsula)
            const protGeo = new THREE.CircleGeometry(0.06, 6);
            const protMat = new THREE.MeshBasicMaterial({ color: 0x6a9ac0, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
            const prot = new THREE.Mesh(protGeo, protMat);
            prot.position.set(pt.x, pt.y, 0.04);
            this.agregarEntorno(prot);
        }
    }

    _registrarMembrana() {
        const g = new THREE.Group();
        g.position.set(3.1, 1.5, 0.03);
        g.userData = {
            id: 'membrana', nombre: 'Membrana Plasmática', emoji: '🛡️',
            descripcion: 'Bicapa lipídica con proteínas insertadas. Controla la entrada y salida de sustancias.',
            datoCurioso: 'Mide solo 7.5 nanómetros de grosor.'
        };
        this.agregarEntorno(g);
        this.organelos.push(g);
    }

    // ═══════════════════════════════════════════════════════
    // 🟣 ENVOLTURA NUCLEAR - ORGÁNULO VISUAL PROPIO
    // ═══════════════════════════════════════════════════════

    _crearEnvolturaNuclear() {
        const g = new THREE.Group();
        const t = 1.15;

        // Anillo exterior de la envoltura
        const envGeo = new THREE.RingGeometry(t * 0.93, t * 1.08, 64);
        const envMat = new THREE.MeshBasicMaterial({ map: this.texturas.envoltura, color: 0xb84a88, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
        const env = new THREE.Mesh(envGeo, envMat);
        env.position.z = 0.006;
        g.add(env);

        // Borde fino
        const bordeGeo = new THREE.RingGeometry(t * 1.07, t * 1.09, 64);
        const bordeMat = new THREE.MeshBasicMaterial({ color: 0x9a3a6a, side: THREE.DoubleSide, transparent: true, opacity: 0.55 });
        const borde = new THREE.Mesh(bordeGeo, bordeMat);
        borde.position.z = 0.007;
        g.add(borde);

        // Poros nucleares (pequeños anillos en la envoltura)
        for (let i = 0; i < 10; i++) {
            const a = (i / 10) * Math.PI * 2 + 0.15;
            const px = Math.cos(a) * t * 1.005;
            const py = Math.sin(a) * t * 1.005;
            const poroGeo = new THREE.RingGeometry(0.025, 0.05, 8);
            const poroMat = new THREE.MeshBasicMaterial({ color: 0xd0c0d8, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
            const poro = new THREE.Mesh(poroGeo, poroMat);
            poro.position.set(px, py, 0.008);
            g.add(poro);
        }

        g.position.set(0, 0.15, 0.19);
        this._registrar(g, 'envoltura', 'Envoltura Nuclear', '🟣',
            'Doble membrana con poros que rodea el núcleo. Regula el paso de moléculas entre núcleo y citoplasma.',
            'Los poros nucleares permiten el paso selectivo de ARN y proteínas.');
    }

    _crearNucleo() {
        const g = new THREE.Group(), t = 1.0;
        // Sombra externa (halo suave)
        const sombraGeo = new THREE.CircleGeometry(t * 1.06, 56);
        const sombraMat = new THREE.MeshBasicMaterial({ color: 0xc080a0, side: THREE.DoubleSide, transparent: true, opacity: 0.2, depthWrite: false });
        const sombra = new THREE.Mesh(sombraGeo, sombraMat);
        sombra.position.z = -0.005;
        g.add(sombra);

        // Cuerpo del núcleo
        g.add(this._meshTextura(t, this.texturas.nucleo, 0.002, 0.94));

        // Borde interno
        const bordeGeo = new THREE.RingGeometry(t * 0.96, t, 56);
        const bordeMat = new THREE.MeshBasicMaterial({ color: 0x9a4a78, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
        const borde = new THREE.Mesh(bordeGeo, bordeMat);
        borde.position.z = 0.003;
        g.add(borde);

        g.position.set(0, 0.15, 0.2);
        this._registrar(g, 'nucleo', 'Núcleo', '🧬',
            'Centro de control celular. Contiene el ADN organizado en cromatina.',
            'El ADN de una célula humana mide 2 metros estirado.');
    }

    _crearNucleolo() {
        const g = new THREE.Group();
        g.add(this._meshTextura(0.34, this.texturas.nucleolo, 0, 0.92));
        g.position.set(0, 0.05, 0.21);
        this._registrar(g, 'nucleolo', 'Nucléolo', '🎯',
            'Región donde se sintetiza el ARN ribosómico.',
            'Ocupa hasta el 25% del volumen nuclear.');
    }

    // ═══════════════════════════════════════════════════════
    // 🌿 RER - CINTAS GRUESAS (NO LÍNEAS FINAS)
    // ═══════════════════════════════════════════════════════

    _crearRER() {
        const g = new THREE.Group();
        const cx = 0, cy = 0.15;
        const numSacos = 5;

        for (let i = 0; i < numSacos; i++) {
            const radioBase = 1.22 + i * 0.16;
            const s = new THREE.Shape();
            const inicio = 0.08, fin = 1.58;
            const numPts = 40;

            // Borde externo
            for (let j = 0; j <= numPts; j++) {
                const a = inicio + (j / numPts) * (fin - inicio);
                const ond = 1 + Math.sin(a * 4.3 + i * 0.7) * 0.035;
                const x = cx + Math.cos(a) * radioBase * ond;
                const y = cy + Math.sin(a) * radioBase * 0.9 * ond;
                if (j === 0) s.moveTo(x, y);
                else s.lineTo(x, y);
            }

            // Borde interno (más pequeño)
            const radioInt = radioBase - 0.14;
            for (let j = numPts; j >= 0; j--) {
                const a = inicio + (j / numPts) * (fin - inicio);
                const ond = 1 + Math.sin(a * 4.3 + i * 0.7) * 0.035;
                const x = cx + Math.cos(a) * radioInt * ond;
                const y = cy + Math.sin(a) * radioInt * 0.9 * ond;
                s.lineTo(x, y);
            }
            s.closePath();

            // Relleno sólido (cinta gruesa)
            const geo = new THREE.ShapeGeometry(s);
            const alpha = 0.6 - i * 0.06;
            const mat = new THREE.MeshBasicMaterial({ color: 0xb8e65a, side: THREE.DoubleSide, transparent: true, opacity: alpha });
            g.add(new THREE.Mesh(geo, mat));

            // Borde de la cinta
            const pts = s.getPoints(60);
            g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x8cc740, transparent: true, opacity: 0.45 })));

            // Ribosomas en borde externo
            const riboGeo = new THREE.BufferGeometry();
            const ribo = [];
            for (let k = 0; k < 22; k++) {
                const a = inicio + (k / 22) * (fin - inicio);
                const rr = radioBase * 1.03;
                ribo.push(cx + Math.cos(a) * rr + (Math.random()-0.5)*0.04, cy + Math.sin(a) * rr * 0.9 + (Math.random()-0.5)*0.04, 0);
            }
            riboGeo.setAttribute('position', new THREE.Float32BufferAttribute(ribo, 3));
            g.add(new THREE.Points(riboGeo, new THREE.PointsMaterial({ color: 0x8f59d1, size: 0.045, transparent: true, opacity: 0.6 })));
        }

        g.position.set(0, 0, 0.13);
        this._registrar(g, 'rer', 'Retículo Endoplasmático Rugoso', '🌿',
            'Sacos aplanados con ribosomas. Fabrica y modifica proteínas.',
            'Más del 50% de las membranas celulares.');
    }

    _crearREL() {
        const g = new THREE.Group(), geo = new THREE.BufferGeometry(), pos = [];
        for (let i = 0; i < 400; i++) {
            const a = Math.random()*Math.PI*2, r = 1.6+Math.random()*2.2;
            const x = Math.cos(a)*r, y = Math.sin(a)*r*0.85;
            if (Math.sqrt(x*x+(y-0.15)*(y-0.15)) > 1.3) pos.push(x, y, 0);
        }
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        g.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xb8e65a, size: 0.04, transparent: true, opacity: 0.3 })));
        g.position.z = 0.11;
        this._registrar(g, 'rel', 'Retículo Endoplasmático Liso', '🌱',
            'Red tubular sin ribosomas. Sintetiza lípidos.',
            'Abundante en células hepáticas.');
    }

    // ═══════════════════════════════════════════════════════
    // 📦 GOLGI - MÁS COMPACTO, MÁS CERCA DEL NÚCLEO
    // ═══════════════════════════════════════════════════════

   _crearGolgi() {
    const g = new THREE.Group();
    const px = 1.35, py = 0.8;
    
    // Crear 6 cisternas con tamaños y curvaturas variadas
    const cisternas = [
        { ancho: 0.85, alto: 0.10, curva: 0.06, direccion: -1 },  // ) hacia izquierda
        { ancho: 0.75, alto: 0.09, curva: 0.05, direccion: -1 },
        { ancho: 0.65, alto: 0.09, curva: 0.05, direccion: -1 },
        { ancho: 0.58, alto: 0.08, curva: 0.04, direccion: 1 },   // ( hacia derecha
        { ancho: 0.68, alto: 0.08, curva: 0.05, direccion: 1 },
        { ancho: 0.78, alto: 0.09, curva: 0.06, direccion: 1 },
    ];

    cisternas.forEach((cfg, i) => {
        const s = new THREE.Shape();
        const numPts = 40;
        const yOffset = (i - 2.5) * 0.11;
        const offsetX = cfg.direccion * 0.08;

        for (let j = 0; j <= numPts; j++) {
            const a = (j / numPts) * Math.PI * 2;
            // Curvatura asimétrica: más pronunciada en los extremos
            const curvaY = Math.sin(a) * cfg.curva * (1 - Math.abs(Math.cos(a)) * 0.5);
            const x = Math.cos(a) * cfg.ancho * 0.8 + offsetX;
            const y = Math.sin(a) * cfg.alto + yOffset + curvaY;
            if (j === 0) s.moveTo(x, y);
            else s.lineTo(x, y);
        }

        const geo = new THREE.ShapeGeometry(s);
        const mat = new THREE.MeshBasicMaterial({
            map: this.texturas.golgi,
            color: 0xf7b955,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.55 - i * 0.03
        });
        g.add(new THREE.Mesh(geo, mat));

        // Borde
        const pts = s.getPoints(40);
        g.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({ color: 0xe3912d, transparent: true, opacity: 0.4 - i * 0.03 })
        ));
    });

    // Vesículas en los extremos
    const vesGeo = new THREE.BufferGeometry();
    const vesPos = [];
    for (let i = 0; i < 20; i++) {
        const lado = Math.random() > 0.5 ? 1 : -1;
        const x = px + lado * (0.3 + Math.random() * 0.4);
        const y = py + (Math.random() - 0.5) * 0.5;
        vesPos.push(x, y, 0);
    }
    vesGeo.setAttribute('position', new THREE.Float32BufferAttribute(vesPos, 3));
    g.add(new THREE.Points(vesGeo, new THREE.PointsMaterial({
        color: 0xffd278, size: 0.06, transparent: true, opacity: 0.55
    })));

    g.position.set(px, py, 0.16);
    this._registrar(g, 'golgi', 'Aparato de Golgi', '📦',
        'Cisternas apiladas asimétricas. Modifica y empaqueta proteínas.',
        'Cara cis y cara trans con direcciones opuestas.');
}

    // ═══════════════════════════════════════════════════════
    // ⚡ MITOCONDRIAS - BORDE AMARILLO + INTERIOR ROJO ONDULADO
    // ═══════════════════════════════════════════════════════

    _crearMitocondrias() {
    const datos = [
        { x: -2.1, y: -0.5, r: -0.2, t: 0.55 },
        { x: 2.15, y: -1.0, r: 0.4, t: 0.48 },
        { x: -1.0, y: -1.85, r: 1.0, t: 0.4 },
    ];
    datos.forEach((d, idx) => {
        const g = new THREE.Group();
        const s = this._formaSalchicha(d.t); // ← Usar salchicha, no frijol

        // Borde amarillo grueso
        const ptsBorde = s.getPoints(60);
        g.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(ptsBorde),
            new THREE.LineBasicMaterial({ color: 0xf0b830, linewidth: 3, transparent: true, opacity: 0.85 })
        ));

        // Cuerpo con crestas rojas ondeantes
        g.add(this._meshShapeTextura(s, this.texturas.mitocondria, 0xffe0c0, 0, 0.9));

        // Crestas ondeantes (ondas dentro de la salchicha)
        for (let c = 0; c < 8; c++) {
            const pct = c / 7;
            const cx = (pct - 0.5) * d.t * 0.65;
            const h = d.t * 0.16 * Math.sin(pct * Math.PI);
            const ptsCresta = [];
            for (let j = 0; j <= 10; j++) {
                const t2 = j / 10;
                const y = (t2 - 0.5) * h * 2;
                const ondX = Math.sin(t2 * Math.PI * 4) * 0.05 * d.t;
                ptsCresta.push(new THREE.Vector3(cx + ondX, y, 0.006));
            }
            g.add(new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(ptsCresta),
                new THREE.LineBasicMaterial({ color: 0xc04040, transparent: true, opacity: 0.5 })
            ));
        }

        g.rotation.z = d.r;
        g.position.set(d.x, d.y, 0.15);
        this._registrar(g, `mito${idx+1}`, 'Mitocondria', '⚡',
            'Central energética con crestas internas. Produce ATP.',
            'ADN heredado solo de la madre.');
    });
}

    _crearLisosomas() {
        const datos = [{ x:-1.85, y:1.2, t:0.25 }, { x:2.0, y:0.2, t:0.22 }];
        datos.forEach((d, idx) => {
            const g = new THREE.Group();

            // Cuerpo de galleta
            g.add(this._meshTextura(d.t, this.texturas.lisosoma, 0, 0.9));

            // Borde
            g.add(new THREE.Mesh(new THREE.RingGeometry(d.t*0.82, d.t, 20), new THREE.MeshBasicMaterial({ color: 0xd08030, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })));

            // Chispas superpuestas
            const chispasGeo = new THREE.BufferGeometry();
            const chispasPos = [];
            for (let i = 0; i < 20; i++) {
                const a = Math.random() * Math.PI * 2;
                const r = Math.random() * d.t * 0.6;
                chispasPos.push(Math.cos(a) * r, Math.sin(a) * r, 0.005);
            }
            chispasGeo.setAttribute('position', new THREE.Float32BufferAttribute(chispasPos, 3));
            g.add(new THREE.Points(chispasGeo, new THREE.PointsMaterial({ color: 0x6a3050, size: 0.04, transparent: true, opacity: 0.6 })));

            g.position.set(d.x, d.y, 0.18);
            this._registrar(g, `liso${idx+1}`, 'Lisosoma', '🟠',
                'Vesícula digestiva con enzimas.',
                'pH interno ~5.0.');
        });
    }

    _crearPeroxisoma() {
        const g = new THREE.Group();
        g.add(this._meshCirculo(0.22, 0xffb347, 0, 0.75));
        g.add(new THREE.Mesh(new THREE.RingGeometry(0.18, 0.22, 16), new THREE.MeshBasicMaterial({ color: 0xe3912d, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })));
        g.position.set(-2.15, -1.3, 0.18);
        this._registrar(g, 'peroxisoma', 'Peroxisoma', '🧪', 'Organelo oxidativo.', 'Fisión binaria.');
    }

    _crearVacuola() {
        const g = new THREE.Group();
        g.add(this._meshTextura(0.33, this.texturas.vacuola, 0, 0.65));
        g.add(new THREE.Mesh(new THREE.RingGeometry(0.28, 0.33, 20), new THREE.MeshBasicMaterial({ color: 0x8fb7ff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 })));
        g.position.set(1.1, -1.5, 0.17);
        this._registrar(g, 'vacuola', 'Vacuola', '💧', 'Almacenamiento.', '90% en vegetales.');
    }

    _crearVesiculas() {
        [{ x:0.55, y:0.7 }, { x:0.85, y:1.05 }].forEach(d => {
            const g = new THREE.Group();
            g.add(this._meshCirculo(0.1, 0xffd278, 0, 0.65));
            g.position.set(d.x, d.y, 0.22);
            this.agregarEntorno(g);
        });
    }

    // ═══════════════════════════════════════════════════════
    // 🎪 CENTROSOMA - DOS CILINDROS/CHURROS
    // ═══════════════════════════════════════════════════════

    _crearCentrosoma() {
        const g = new THREE.Group();
        const largo = 0.22, ancho = 0.07;

        const ch1 = new THREE.Shape();
        ch1.moveTo(-ancho/2, -largo/2); ch1.lineTo(ancho/2, -largo/2);
        ch1.lineTo(ancho/2, largo/2); ch1.lineTo(-ancho/2, largo/2); ch1.closePath();
        g.add(new THREE.Mesh(new THREE.ShapeGeometry(ch1), new THREE.MeshBasicMaterial({ color: 0xd94b6a, side: THREE.DoubleSide, transparent: true, opacity: 0.82 })));
        g.add(this._bordeShape(ch1, 0xb03a50, 0.002, 0.5));

        const ch2 = new THREE.Shape();
        ch2.moveTo(-largo/2, -ancho/2); ch2.lineTo(largo/2, -ancho/2);
        ch2.lineTo(largo/2, ancho/2); ch2.lineTo(-largo/2, ancho/2); ch2.closePath();
        g.add(new THREE.Mesh(new THREE.ShapeGeometry(ch2), new THREE.MeshBasicMaterial({ color: 0xd94b6a, side: THREE.DoubleSide, transparent: true, opacity: 0.82 })));
        g.add(this._bordeShape(ch2, 0xb03a50, 0.002, 0.5));

        g.position.set(-1.6, -1.55, 0.19);
        this._registrar(g, 'centrosoma', 'Centrosoma', '🎪',
            'Centro organizador de microtúbulos. Dos centriolos perpendiculares.',
            'Se duplica en la división celular.');
    }

    _crearRibosomas() {
        const g = new THREE.Group(), geo = new THREE.BufferGeometry(), pos = [];
        for (let i = 0; i < 600; i++) {
            const a = Math.random()*Math.PI*2, r = Math.random()*3.7;
            const x = Math.cos(a)*r, y = Math.sin(a)*r;
            if (Math.sqrt(x*x+(y-0.15)*(y-0.15)) > 1.3) pos.push(x, y, 0);
        }
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        g.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x8f59d1, size: 0.032, transparent: true, opacity: 0.45 })));
        g.position.z = 0.08;
        this.agregarEntorno(g);
    }

    // ═══════════════════════════════════════════════════
    // ETIQUETAS + CONECTORES (MÁS PEQUEÑAS, MÁS SUTILES)
    // ═══════════════════════════════════════════════════

    _crearEtiquetasYConectores() {
        const ids = ['membrana', 'envoltura', 'nucleo', 'nucleolo', 'rer', 'golgi', 'mito1', 'mito2', 'liso1', 'vacuola', 'centrosoma', 'peroxisoma'];
        const etiquetables = this.organelos.filter(org => ids.includes(org.userData.id));

        const anclajes = {
            'nucleo':     { x: -0.7, y: 0.9 },
            'nucleolo':   { x: 0.0, y: 0.05 },
            'envoltura':  { x: 0.8, y: 0.9 },
            'rer':        { x: 0.95, y: 1.15 },
            'membrana':   { x: 2.8, y: 1.8 },
        };

        etiquetables.forEach(org => {
            const data = org.userData;
            const svgG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            this.svgLayer.appendChild(svgG);

            const linea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            linea.setAttribute('stroke', '#5a7a9a');
            linea.setAttribute('stroke-width', '1');
            linea.setAttribute('stroke-dasharray', '3,3');
            linea.setAttribute('opacity', '0.5');
            svgG.appendChild(linea);

            const circOrg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circOrg.setAttribute('r', '2.5');
            circOrg.setAttribute('fill', '#5a7a9a');
            circOrg.setAttribute('opacity', '0.5');
            svgG.appendChild(circOrg);

            const btn = document.createElement('button');
            btn.textContent = `${data.emoji} ${data.nombre}`;
            btn.style.cssText = `
                position:absolute; pointer-events:all; cursor:pointer;
                background:rgba(255,255,255,0.88); color:#3a5a7a;
                border:1px solid rgba(0,0,0,0.08); border-radius:10px;
                padding:4px 10px; font-family:'Fredoka',system-ui,sans-serif;
                font-size:10px; font-weight:500; white-space:nowrap;
                transition:all 0.2s ease; box-shadow:0 1px 6px rgba(0,0,0,0.05);
                outline:none; transform:translate(-50%,-50%);
            `;

            btn.addEventListener('mouseenter', () => {
                this.hoverId = data.id;
                btn.style.background = '#ffffff';
                btn.style.borderColor = '#4a6a8a';
                btn.style.transform = 'translate(-50%,-50%) scale(1.06)';
                linea.setAttribute('stroke', '#3a5a7a');
                linea.setAttribute('stroke-width', '1.5');
                linea.setAttribute('opacity', '0.8');
                circOrg.setAttribute('fill', '#3a5a7a');
                circOrg.setAttribute('r', '4');
                circOrg.setAttribute('opacity', '0.8');
            });

            btn.addEventListener('mouseleave', () => {
                this.hoverId = null;
                btn.style.background = 'rgba(255,255,255,0.88)';
                btn.style.borderColor = 'rgba(0,0,0,0.08)';
                btn.style.transform = 'translate(-50%,-50%) scale(1)';
                linea.setAttribute('stroke', '#5a7a9a');
                linea.setAttribute('stroke-width', '1');
                linea.setAttribute('opacity', '0.5');
                circOrg.setAttribute('fill', '#5a7a9a');
                circOrg.setAttribute('r', '2.5');
                circOrg.setAttribute('opacity', '0.5');
            });

            btn.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); this._mostrarModal(data); });

            this.etiquetasContainer.appendChild(btn);
            this.etiquetas.push({ element: btn, linea, circOrg, organelo: org, id: data.id, anclaje: anclajes[data.id] || null });
        });

        requestAnimationFrame(() => this._actualizarConectores());
    }

    _actualizarConectores() {
        const container = document.getElementById('canvas-container');
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;

        this.etiquetas.forEach(({ element, linea, circOrg, organelo, anclaje }) => {
            let orgX, orgY;
            if (anclaje) {
                const p3 = new THREE.Vector3(anclaje.x, anclaje.y, organelo.position.z);
                organelo.localToWorld(p3);
                p3.project(this.camera);
                orgX = (p3.x*0.5+0.5)*rect.width + rect.left;
                orgY = (-p3.y*0.5+0.5)*rect.height + rect.top;
            } else {
                const p3 = new THREE.Vector3();
                organelo.getWorldPosition(p3);
                p3.project(this.camera);
                orgX = (p3.x*0.5+0.5)*rect.width + rect.left;
                orgY = (-p3.y*0.5+0.5)*rect.height + rect.top;
            }
            const dx = orgX-cx, dy = orgY-cy;
            const dist = Math.sqrt(dx*dx+dy*dy) || 1;
            const radioEtq = Math.min(rect.width, rect.height)*0.44;
            const etqX = cx + dx*Math.max(radioEtq/dist, 1.0);
            const etqY = cy + dy*Math.max(radioEtq/dist, 1.0);

            element.style.left = etqX+'px'; element.style.top = etqY+'px';
            linea.setAttribute('x1', orgX); linea.setAttribute('y1', orgY);
            linea.setAttribute('x2', etqX); linea.setAttribute('y2', etqY);
            circOrg.setAttribute('cx', orgX); circOrg.setAttribute('cy', orgY);
        });
    }

    // ═══════════════════════════════════════════════════
    // MODAL
    // ═══════════════════════════════════════════════════

    _onKeyDown(e) { if (e.key === 'Escape' && this.modalActivo) this._cerrarModal(); }

    _mostrarModal(data) {
        if (this.modalActivo) return;
        this.modalActivo = true;
        if (ModalManager && ModalManager.mostrar) {
            ModalManager.mostrar({ titulo: `${data.emoji} ${data.nombre}`, descripcion: data.descripcion, datoCurioso: data.datoCurioso || '' });
            this._checkModalCerrado = setInterval(() => {
                const modal = document.getElementById('modal-info');
                if (modal && modal.classList.contains('oculto')) { clearInterval(this._checkModalCerrado); setTimeout(() => { this.modalActivo = false; }, 250); }
            }, 100);
        }
    }

    _cerrarModal() {
        if (ModalManager && ModalManager.cerrar) ModalManager.cerrar();
        if (this._checkModalCerrado) { clearInterval(this._checkModalCerrado); this._checkModalCerrado = null; }
        setTimeout(() => { this.modalActivo = false; }, 250);
    }

    // ═══════════════════════════════════════════════════
    // UPDATE
    // ═══════════════════════════════════════════════════

    update() {
        this._actualizarConectores();
        this.organelos.forEach(org => {
            const d = org.userData;
            if (!d || this.modalActivo) return;
            const t = (this.hoverId === d.id) ? 1.05 : 1.0;
            org.scale.set(org.scale.x+(t-org.scale.x)*0.12, org.scale.y+(t-org.scale.y)*0.12, 1);
        });
    }

    destroy() {
        this._cerrarModal();
        if (this.svgLayer) { this.svgLayer.remove(); this.svgLayer = null; }
        if (this.etiquetasContainer) { this.etiquetasContainer.remove(); this.etiquetasContainer = null; }
        if (this._keydown) window.removeEventListener('keydown', this._keydown);
        window.removeEventListener('resize', () => this._actualizarConectores());
        this.organelos = []; this.etiquetas = [];
        super.destroy();
    }
}