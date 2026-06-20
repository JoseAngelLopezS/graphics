import { CanvasLocal } from './canvasLocal.js';

const canvas = document.getElementById('circlechart');
const graphics = canvas.getContext('2d');
const miCanvas = new CanvasLocal(graphics, canvas);

// Elementos de la interfaz (Asegúrate que existan estos IDs en tu index.html)
const inputFun = document.getElementById('fun-input');
const btnDraw = document.getElementById('btn-draw');
const btnIn = document.getElementById('btn-zoom-in');
const btnOut = document.getElementById('btn-zoom-out');

const actualizar = () => {
    const formula = inputFun ? inputFun.value : "x*x";
    miCanvas.paint(formula);
};

// Asignar eventos si los botones existen
btnDraw?.addEventListener('click', actualizar);
btnIn?.addEventListener('click', () => { miCanvas.setZoom(0.8); actualizar(); });
btnOut?.addEventListener('click', () => { miCanvas.setZoom(1.2); actualizar(); });

// Dibujo inicial
actualizar();
