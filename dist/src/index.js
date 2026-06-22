"use strict";
const canvas = document.getElementById('circlechart');
const graphics = canvas.getContext('2d');
const archivoModelo = document.getElementById('archivoModelo');
const contenidoArchivo = document.getElementById('contenidoArchivo');
function limpiarCanvas() {
    graphics.clearRect(0, 0, canvas.width, canvas.height);
}
function mostrarMensajeCanvas(titulo, subtitulo) {
    limpiarCanvas();
    graphics.fillStyle = '#f8f9fa';
    graphics.fillRect(0, 0, canvas.width, canvas.height);
    graphics.strokeStyle = '#cccccc';
    graphics.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    graphics.fillStyle = '#333333';
    graphics.font = '22px Arial';
    graphics.textAlign = 'center';
    graphics.fillText(titulo, canvas.width / 2, canvas.height / 2 - 20);
    graphics.font = '16px Arial';
    graphics.fillText(subtitulo, canvas.width / 2, canvas.height / 2 + 15);
}
function analizarContenido(texto) {
    const lineas = texto
        .split(/\r?\n/)
        .map(linea => linea.trim())
        .filter(linea => linea !== '' && !linea.startsWith('#'));
    const vertices = lineas.filter(linea => linea.startsWith('v ')).length;
    const aristas = lineas.filter(linea => linea.startsWith('e ')).length;
    const movimientos = lineas.filter(linea => linea.startsWith('mov ')).length;
    mostrarMensajeCanvas('Archivo lampara.dat cargado correctamente', `Vértices: ${vertices} | Aristas: ${aristas} | Movimientos: ${movimientos}`);
}
mostrarMensajeCanvas('Proyecto Final: Lámpara 3D', 'Selecciona el archivo lampara.dat para mostrar su contenido.');
archivoModelo.addEventListener('change', () => {
    var _a;
    const archivo = (_a = archivoModelo.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!archivo) {
        contenidoArchivo.textContent = 'No se seleccionó ningún archivo.';
        return;
    }
    const lector = new FileReader();
    lector.onload = () => {
        var _a;
        const texto = String((_a = lector.result) !== null && _a !== void 0 ? _a : '');
        contenidoArchivo.textContent = texto;
        analizarContenido(texto);
    };
    lector.onerror = () => {
        contenidoArchivo.textContent = 'Ocurrió un error al leer el archivo.';
        mostrarMensajeCanvas('Error al cargar archivo', 'No fue posible leer el archivo seleccionado.');
    };
    lector.readAsText(archivo);
});
