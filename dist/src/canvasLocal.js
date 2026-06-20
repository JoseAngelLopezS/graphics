export class CanvasLocal {
    constructor(g, canvas) {
        this.graphics = g;
        this.maxX = canvas.width - 1;
        this.maxY = canvas.height - 1;
        this.centerX = this.maxX / 2;
        this.centerY = this.maxY / 2;
        // Configuración de visualización inicial
        this.rWidth = 10;
        this.rHeight = 10;
        this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
    }

    // Métodos de conversión de coordenadas
    iX(x) { return Math.round(this.centerX + x / this.pixelSize); }
    iY(y) { return Math.round(this.centerY - y / this.pixelSize); }

    drawLine(x1, y1, x2, y2) {
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.stroke();
    }

    setZoom(factor) {
        this.rWidth *= factor;
        this.rHeight *= factor;
        this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
    }

    paint(expression) {
        // Limpiar lienzo
        this.graphics.clearRect(0, 0, this.maxX + 1, this.maxY + 1);

        // Dibujar Ejes (para que no esté vacío)
        this.graphics.strokeStyle = '#cccccc';
        this.drawLine(0, this.centerY, this.maxX, this.centerY);
        this.drawLine(this.centerX, 0, this.centerX, this.maxY);

        // Dibujar la función
        this.graphics.strokeStyle = 'red';
        this.graphics.lineWidth = 2;
        let first = true;

        for (let px = 0; px <= this.maxX; px++) {
            const x = (px - this.centerX) * this.pixelSize;
            try {
                // Evaluamos la expresión (ej: x*x)
                const y = eval(expression.replace(/x/g, `(${x})`));
                const py = this.iY(y);

                if (first) {
                    this.graphics.beginPath();
                    this.graphics.moveTo(px, py);
                    first = false;
                } else {
                    this.graphics.lineTo(px, py);
                }
            } catch (e) { /* Error en fórmula */ }
        }
        this.graphics.stroke();
    }
}
