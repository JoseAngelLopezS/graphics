export class CanvasLocal {
    constructor(g, canvas) {
        this.graphics = g;
        this.rWidth = 6;
        this.rHeight = 4;
        this.maxX = canvas.width - 1;
        this.maxY = canvas.height - 1;
        this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
        this.centerX = this.maxX / 2;
        this.centerY = this.maxY / 2;
    }
    drawLine(x1, y1, x2, y2) {
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.closePath();
        this.graphics.stroke();
    }
    paint() {
        this.graphics.strokeStyle = 'black';
        this.graphics.lineWidth = 2;
        this.drawLine(220, 140, 420, 140);
        this.drawLine(420, 140, 420, 340);
        this.drawLine(420, 340, 220, 340);
        this.drawLine(220, 340, 220, 140);
    }
}
