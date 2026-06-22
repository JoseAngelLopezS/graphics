import { CanvasLocal } from './canvasLocal.js';

let canvas = document.getElementById('circlechart');
let graphics = canvas.getContext('2d');

const miCanvas = new CanvasLocal(graphics, canvas);

// Arreglo idéntico al de la clase para iniciar
let arregloBase = [35, 15, 25, 100, 60, 90];
miCanvas.paint(arregloBase);

// Lógica para leer desde la pantalla y actualizar el gráfico
const btnDibujar = document.getElementById('btnDibujar');
const inputDatos = document.getElementById('datosEntrada');

if (btnDibujar && inputDatos) {
    btnDibujar.addEventListener('click', () => {
        const valor = inputDatos.value;
        if (valor.trim() !== '') {
            const arregloNumeros = valor.split(',')
                                        .map(item => parseFloat(item.trim()))
                                        .filter(num => !isNaN(num));
            
            if (arregloNumeros.length > 0) {
                miCanvas.paint(arregloNumeros);
            } else {
                alert("Por favor ingresa valores numéricos válidos separados por coma.");
            }
        } else {
            alert("El campo de texto está vacío. Escribe algo como: 20, 50, 80");
        }
    });
}
