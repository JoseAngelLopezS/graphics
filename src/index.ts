import { CanvasLocal } from './canvasLocal.js';

const canvas = document.getElementById('circlechart') as HTMLCanvasElement;
const graphics = canvas.getContext('2d') as CanvasRenderingContext2D;
const miCanvas = new CanvasLocal(graphics, canvas);

const inputFun = document.getElementById('fun-input') as HTMLInputElement;
const btnDraw = document.getElementById('btn-draw') as HTMLButtonElement;
const btnIn = document.getElementById('btn-zoom-in') as HTMLButtonElement;
const btnOut = document.getElementById('btn-zoom-out') as HTMLButtonElement;

const actualizar = () => {
  if (miCanvas && inputFun) {
    miCanvas.paint(inputFun.value);
  }
};

btnDraw?.addEventListener('click', actualizar);
btnIn?.addEventListener('click', () => { miCanvas.setZoom(0.8); actualizar(); });
btnOut?.addEventListener('click', () => { miCanvas.setZoom(1.2); actualizar(); });

// Dibujo inicial
actualizar();
