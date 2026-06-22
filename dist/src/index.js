import { CanvasLocal } from './canvasLocal.js';
const canvas = document.getElementById('circlechart');
const graphics = canvas.getContext('2d');
const archivoModelo = document.getElementById('archivoModelo');
const contenidoArchivo = document.getElementById('contenidoArchivo');
const miCanvas = new CanvasLocal(graphics, canvas);
function parsearModelo(texto) {
    const vertices = [];
    const aristas = [];
    const lineas = texto.split(/\r?\n/);
    for (const lineaOriginal of lineas) {
        const linea = lineaOriginal.trim();
        if (linea === '' || linea.startsWith('#')) {
            continue;
        }
        const partes = linea.split(/\s+/);
        if (partes[0] === 'v' && partes.length >= 6) {
            vertices.push({
                id: Number(partes[1]),
                x: Number(partes[2]),
                y: Number(partes[3]),
                z: Number(partes[4]),
                pieza: partes[5]
            });
        }
        if (partes[0] === 'e' && partes.length >= 4) {
            aristas.push({
                a: Number(partes[1]),
                b: Number(partes[2]),
                pieza: partes[3]
            });
        }
    }
    return {
        vertices,
        aristas
    };
}
function analizarContenido(texto) {
    const lineas = texto
        .split(/\r?\n/)
        .map(linea => linea.trim())
        .filter(linea => linea !== '' && !linea.startsWith('#'));
    const vertices = lineas.filter(linea => linea.startsWith('v ')).length;
    const aristas = lineas.filter(linea => linea.startsWith('e ')).length;
    const movimientos = lineas.filter(linea => linea.startsWith('mov ')).length;
    const modelo = parsearModelo(texto);
    if (modelo.vertices.length === 0 || modelo.aristas.length === 0) {
        miCanvas.dibujarMensaje('No se pudo dibujar el modelo', 'El archivo no contiene vértices o aristas válidas.');
        return;
    }
    miCanvas.setModelo(modelo.vertices, modelo.aristas);
    console.log('Modelo cargado correctamente');
    console.log(`Vértices: ${vertices}`);
    console.log(`Aristas: ${aristas}`);
    console.log(`Movimientos: ${movimientos}`);
}
miCanvas.dibujarMensaje('Proyecto Final: Lámpara 3D', 'Selecciona el archivo lampara.dat para dibujar el modelo.');
function filtrarContenidoVisible(texto) {
    return texto
        .split(/\r?\n/)
        .map(linea => linea.trim())
        .filter(linea => linea !== '' && !linea.startsWith('#'))
        .join('\n');
}
archivoModelo.addEventListener('change', () => {
    const archivo = archivoModelo.files && archivoModelo.files[0];
    if (!archivo) {
        contenidoArchivo.textContent = 'No se seleccionó ningún archivo.';
        return;
    }
    const lector = new FileReader();
    lector.onload = () => {
        const texto = String(lector.result || '');
        contenidoArchivo.textContent = filtrarContenidoVisible(texto);
        analizarContenido(texto);
    };
    lector.onerror = () => {
        contenidoArchivo.textContent = 'Ocurrió un error al leer el archivo.';
        miCanvas.dibujarMensaje('Error al cargar archivo', 'No fue posible leer el archivo seleccionado.');
    };
    lector.readAsText(archivo);
});
let arrastrando = false;
let ultimoX = 0;
let ultimoY = 0;
canvas.addEventListener('mousedown', evento => {
    arrastrando = true;
    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
});
canvas.addEventListener('mousemove', evento => {
    if (!arrastrando) {
        return;
    }
    const deltaX = evento.clientX - ultimoX;
    const deltaY = evento.clientY - ultimoY;
    miCanvas.rotarVista(deltaX, deltaY);
    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
});
canvas.addEventListener('mouseup', () => {
    arrastrando = false;
});
canvas.addEventListener('mouseleave', () => {
    arrastrando = false;
});
canvas.addEventListener('wheel', evento => {
    evento.preventDefault();
    if (evento.deltaY < 0) {
        miCanvas.cambiarZoom(0.1);
    }
    else {
        miCanvas.cambiarZoom(-0.1);
    }
});
function conectarBoton(id, accion) {
    const boton = document.getElementById(id);
    if (boton) {
        boton.addEventListener('click', accion);
    }
}
conectarBoton('btnBrazoInferiorArriba', () => {
    miCanvas.moverPieza('brazo_inferior', 5);
});
conectarBoton('btnBrazoInferiorAbajo', () => {
    miCanvas.moverPieza('brazo_inferior', -5);
});
conectarBoton('btnBrazoSuperiorArriba', () => {
    miCanvas.moverPieza('brazo_superior', 5);
});
conectarBoton('btnBrazoSuperiorAbajo', () => {
    miCanvas.moverPieza('brazo_superior', -5);
});
conectarBoton('btnCabezaIzquierda', () => {
    miCanvas.moverPieza('cabeza', 5);
});
conectarBoton('btnCabezaDerecha', () => {
    miCanvas.moverPieza('cabeza', -5);
});
conectarBoton('btnReiniciar', () => {
    miCanvas.reiniciar();
});
