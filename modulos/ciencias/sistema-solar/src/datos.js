// modulos/sistema-solar/src/datos.js

export const DATOS_PLANETAS = [
    {
        id: 'mercurio',
        nombre: 'Mercurio',
        tamano: 0.6,
        distancia: 8,
        velocidad: 0.008,      // ← ANTES: 0.02
        color: 0x8c8c8c,
        textura: '/assets/texturas/mercurio.jpg',
        descripcion: 'Mercurio es el planeta más pequeño del sistema solar y el más cercano al Sol.',
        datoCurioso: 'Un día en Mercurio dura 59 días terrestres.'
    },
    {
        id: 'venus',
        nombre: 'Venus',
        tamano: 0.9,
        distancia: 12,
        velocidad: 0.006,      // ← ANTES: 0.015
        color: 0xe6b800,
        textura: '/assets/texturas/venus.jpg',
        descripcion: 'Venus es el planeta más caliente del sistema solar debido a su densa atmósfera.',
        datoCurioso: 'Venus gira al revés que los demás planetas.'
    },
    {
        id: 'tierra',
        nombre: 'Tierra',
        tamano: 1.0,
        distancia: 16,
        velocidad: 0.005,      // ← ANTES: 0.012
        color: 0x2b82c9,
        textura: '/assets/texturas/tierra.jpg',
        descripcion: 'La Tierra es el único planeta conocido que tiene vida.',
        datoCurioso: 'El 70% de su superficie está cubierta de agua.'
    },
    {
        id: 'marte',
        nombre: 'Marte',
        tamano: 0.7,
        distancia: 20,
        velocidad: 0.004,      // ← ANTES: 0.01
        color: 0xc1440e,
        textura: '/assets/texturas/marte.jpg',
        descripcion: 'Marte es conocido como el "planeta rojo" por su color.',
        datoCurioso: 'Tiene el volcán más grande del sistema solar, el Monte Olimpo.'
    },
    {
        id: 'jupiter',
        nombre: 'Júpiter',
        tamano: 2.2,
        distancia: 28,
        velocidad: 0.003,      // ← ANTES: 0.007
        color: 0xd4a574,
        textura: '/assets/texturas/jupiter.jpg',
        descripcion: 'Júpiter es el planeta más grande del sistema solar.',
        datoCurioso: 'La Gran Mancha Roja es una tormenta que dura más de 300 años.'
    },
    {
        id: 'saturno',
        nombre: 'Saturno',
        tamano: 1.9,
        distancia: 36,
        velocidad: 0.002,      // ← ANTES: 0.005
        color: 0xecb88a,
        textura: '/assets/texturas/saturno.jpg',
        descripcion: 'Saturno es famoso por sus anillos de hielo y roca.',
        datoCurioso: 'Sus anillos están hechos de partículas de hielo y roca.'
    },
    {
        id: 'urano',
        nombre: 'Urano',
        tamano: 1.3,
        distancia: 44,
        velocidad: 0.0015,     // ← ANTES: 0.003
        color: 0x4b70dd,
        textura: '/assets/texturas/urano.jpg',
        descripcion: 'Urano es un planeta gigante de hielo que gira de lado.',
        datoCurioso: 'Su eje de rotación está inclinado casi 90 grados.'
    },
    {
        id: 'neptuno',
        nombre: 'Neptuno',
        tamano: 1.2,
        distancia: 52,
        velocidad: 0.001,      // ← ANTES: 0.002
        color: 0x3b4cb8,
        textura: '/assets/texturas/neptuno.jpg',
        descripcion: 'Neptuno es el planeta más lejano del sistema solar.',
        datoCurioso: 'Tiene los vientos más fuertes del sistema solar.'
    }
];