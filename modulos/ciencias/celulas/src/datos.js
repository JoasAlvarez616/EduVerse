// modulos/ciencias/celulas/src/datos.js

export const DATOS_ORGANELOS = [
    {
        id: 'membrana',
        nombre: 'Membrana Plasmática',
        emoji: '🛡️',
        descripcion: 'Bicapa lipídica que rodea la célula. Controla el paso de sustancias mediante transporte pasivo, activo y mediado por vesículas.',
        datoCurioso: 'La membrana tiene un grosor de solo 7.5 nanómetros, 10,000 veces más delgada que un cabello humano.',
        color: '#c4956a'
    },
    {
        id: 'nucleo',
        nombre: 'Núcleo',
        emoji: '🧠',
        descripcion: 'Centro de control celular. Contiene el ADN organizado en cromatina y está rodeado por una envoltura nuclear doble con poros.',
        datoCurioso: 'El ADN de una sola célula humana mide aproximadamente 2 metros de largo si se estira completamente.',
        color: '#d4a0c0',
        posicion: { x: 0.0, y: 0.2 },
        tamano: 1.3
    },
    {
        id: 'nucleolo',
        nombre: 'Nucléolo',
        emoji: '🎯',
        descripcion: 'Región densa dentro del núcleo donde se sintetiza el ARN ribosómico y se ensamblan las subunidades de los ribosomas.',
        datoCurioso: 'El nucléolo puede representar hasta el 25% del volumen nuclear en células muy activas.',
        color: '#b07090',
        posicion: { x: 0.0, y: 0.1 },
        tamano: 0.35
    },
    {
        id: 'rer',
        nombre: 'Retículo Endoplasmático Rugoso',
        emoji: '📚',
        descripcion: 'Red de sacos aplanados con ribosomas adheridos. Sintetiza y modifica proteínas destinadas a secreción, membrana o lisosomas.',
        datoCurioso: 'Las células secretoras de anticuerpos pueden tener su citoplasma casi completamente ocupado por RER.',
        color: '#8faac9',
        posicion: { x: 0.0, y: 0.2 },
        tamano: 1.3
    },
    {
        id: 'rel',
        nombre: 'Retículo Endoplasmático Liso',
        emoji: '🔬',
        descripcion: 'Red tubular sin ribosomas. Sintetiza lípidos, metaboliza carbohidratos y detoxifica sustancias.',
        datoCurioso: 'Las células del hígado tienen abundante REL para procesar toxinas y medicamentos.',
        color: '#a3c4e0',
        posicion: { x: -0.8, y: 1.4 },
        tamano: 0.6
    },
    {
        id: 'golgi',
        nombre: 'Aparato de Golgi',
        emoji: '📦',
        descripcion: 'Sistema de cisternas apiladas que modifica, clasifica y empaqueta proteínas y lípidos en vesículas para su transporte.',
        datoCurioso: 'El Golgi tiene una orientación definida: cara cis (entrada) y cara trans (salida), como una línea de empaquetado.',
        color: '#d4b896',
        posicion: { x: 1.15, y: 0.7 },
        tamano: 0.7
    },
    {
        id: 'mitocondria1',
        nombre: 'Mitocondria',
        emoji: '⚡',
        descripcion: 'Central energética de la célula. Realiza la respiración celular produciendo ATP mediante la cadena transportadora de electrones.',
        datoCurioso: 'Las mitocondrias tienen su propio ADN circular, similar al de las bacterias, evidencia de su origen evolutivo.',
        color: '#c4b5a0',
        posicion: { x: -1.7, y: -0.3 },
        tamano: 0.55,
        rotacion: -0.3
    },
    {
        id: 'mitocondria2',
        nombre: 'Mitocondria',
        emoji: '⚡',
        descripcion: 'Una célula típica contiene entre 100 y 1000 mitocondrias según su demanda energética.',
        color: '#c4b5a0',
        posicion: { x: 1.8, y: -0.9 },
        tamano: 0.45,
        rotacion: 0.5
    },
    {
        id: 'mitocondria3',
        nombre: 'Mitocondria',
        emoji: '⚡',
        descripcion: 'Organelo semiautónomo con doble membrana. La membrana interna forma crestas para aumentar la superficie.',
        color: '#c4b5a0',
        posicion: { x: -0.8, y: -1.6 },
        tamano: 0.4,
        rotacion: 1.2
    },
    {
        id: 'lisosoma1',
        nombre: 'Lisosoma',
        emoji: '♻️',
        descripcion: 'Vesícula con enzimas hidrolíticas que degrada proteínas, lípidos, carbohidratos y organelos dañados.',
        datoCurioso: 'El pH interno de un lisosoma es ~5.0, mantenido por bombas de protones en su membrana.',
        color: '#c9a0a0',
        posicion: { x: -1.5, y: 1.0 },
        tamano: 0.26
    },
    {
        id: 'lisosoma2',
        nombre: 'Lisosoma',
        emoji: '♻️',
        descripcion: 'Sistema de reciclaje celular que también participa en la autofagia.',
        color: '#c9a0a0',
        posicion: { x: 1.65, y: 0.1 },
        tamano: 0.22
    },
    {
        id: 'peroxisoma',
        nombre: 'Peroxisoma',
        emoji: '🧪',
        descripcion: 'Organelo que contiene enzimas oxidativas. Degrada ácidos grasos y detoxifica peróxido de hidrógeno.',
        datoCurioso: 'Los peroxisomas son los únicos organelos que pueden multiplicarse por fisión binaria como las bacterias.',
        color: '#c9b8a0',
        posicion: { x: -1.9, y: -1.1 },
        tamano: 0.2
    },
    {
        id: 'centrosoma',
        nombre: 'Centrosoma',
        emoji: '🎪',
        descripcion: 'Centro organizador de microtúbulos. Contiene un par de centriolos perpendiculares.',
        datoCurioso: 'El centrosoma se duplica durante la división celular para formar los polos del huso mitótico.',
        color: '#b0a0a0',
        posicion: { x: 0.6, y: -0.55 },
        tamano: 0.22
    },
    {
        id: 'vacuola',
        nombre: 'Vacuola',
        emoji: '💎',
        descripcion: 'Compartimento de almacenamiento de agua, iones y desechos.',
        datoCurioso: 'En células vegetales la vacuola central puede ocupar hasta el 90% del volumen celular.',
        color: '#a0c0d0',
        posicion: { x: -0.7, y: -0.7 },
        tamano: 0.32
    },
    {
        id: 'vesicula1',
        nombre: 'Vesícula de Transporte',
        emoji: '📨',
        descripcion: 'Pequeña esfera membranosa que transporta moléculas entre el RER, Golgi y membrana plasmática.',
        datoCurioso: 'Una célula puede producir y transportar cientos de vesículas por minuto durante períodos de alta actividad.',
        color: '#c0b0a0',
        posicion: { x: 0.55, y: 0.55 },
        tamano: 0.1
    },
    {
        id: 'vesicula2',
        nombre: 'Vesícula de Transporte',
        emoji: '📨',
        descripcion: 'Las vesículas brotan de un compartimento donante y se fusionan con uno aceptor.',
        color: '#c0b0a0',
        posicion: { x: 0.8, y: 0.9 },
        tamano: 0.09
    }
];