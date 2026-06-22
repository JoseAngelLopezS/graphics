export class CanvasLocal {
    constructor(g, canvas) {
        this.graphics = g;
        this.rWidth = 12;
        this.rHeight = 8;
        this.maxX = canvas.width - 1;
        this.maxY = canvas.height - 1;
        this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
        this.centerX = this.maxX / 12;
        this.centerY = this.maxY / 8 * 7;
    }
    iX(x) { return Math.round(this.centerX + x / this.pixelSize); }
    iY(y) { return Math.round(this.centerY - y / this.pixelSize); }
    drawLine(x1, y1, x2, y2) {
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.closePath();
        this.graphics.stroke();
    }
    drawRmboide(x1, y1, x2, y2, x3, y3, x4, y4, color) {
        this.graphics.fillStyle = color;
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.lineTo(x3, y3);
        this.graphics.lineTo(x4, y4);
        this.graphics.closePath();
        this.graphics.stroke();
        this.graphics.fill();
    }
    drawBarra3d(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, color) {
        this.graphics.fillStyle = color;
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.lineTo(x3, y3);
        this.graphics.lineTo(x4, y4);
        this.graphics.lineTo(x5, y5);
        this.graphics.lineTo(x6, y6);
        this.graphics.closePath();
        this.graphics.stroke();
        this.graphics.fill();
    }
    fx(x) {
        return Math.sin(x * 2.5);
    }
    maxH(h) {
        let max = h[0];
        for (let i = 1; i < h.length; i++) {
            if (max < h[i])
                max = h[i];
        }
        let res;
        let pot = 10;
        while (pot < max) {
            pot *= 10;
        }
        pot /= 10;
        res = Math.ceil(max / pot) * pot;
        return res;
    }
    barra(x, y, alt) {
        this.drawLine(this.iX(x), this.iY(0), this.iX(x - 0.5), this.iY(0.5));
        this.drawLine(this.iX(x - 0.5), this.iY(0.5), this.iX(x - 0.5), this.iY(y + alt));
        this.drawLine(this.iX(x - 0.5), this.iY(y + alt), this.iX(x), this.iY(y + alt - 0.5));
        this.drawLine(this.iX(x), this.iY(y + alt - 0.5), this.iX(x + 0.5), this.iY(y + alt));
        this.drawLine(this.iX(x + 0.5), this.iY(y + alt), this.iX(x + 0.5), this.iY(0.5));
        this.drawLine(this.iX(x + 0.5), this.iY(0.5), this.iX(x), this.iY(0));
        this.drawLine(this.iX(x), this.iY(0), this.iX(x), this.iY(y + alt - 0.5));
        this.graphics.strokeStyle = 'gray';
        this.drawLine(this.iX(x - 0.5), this.iY(y + alt), this.iX(x - 0.5), this.iY(this.rHeight - 2));
        this.drawLine(this.iX(x), this.iY(y + alt - 0.5), this.iX(x), this.iY(this.rHeight - 2.5));
        this.drawLine(this.iX(x + 0.5), this.iY(y + alt), this.iX(x + 0.5), this.iY(this.rHeight - 2));
        this.drawLine(this.iX(x - 0.5), this.iY(this.rHeight - 2), this.iX(x), this.iY(this.rHeight - 1.5));
        this.drawLine(this.iX(x + 0.5), this.iY(this.rHeight - 2), this.iX(x), this.iY(this.rHeight - 1.5));
        this.drawLine(this.iX(x - 0.5), this.iY(this.rHeight - 2), this.iX(x), this.iY(this.rHeight - 2.5));
        this.drawLine(this.iX(x + 0.5), this.iY(this.rHeight - 2), this.iX(x), this.iY(this.rHeight - 2.5));
        this.graphics.strokeStyle = 'black';
    }
    paint(h = []) {
        if (!h || h.length === 0) return;
        
        // Limpiamos el canvas entero
        this.graphics.clearRect(0, 0, this.graphics.canvas.width, this.graphics.canvas.height);
        
        let maxEsc;
        let colors = ['magenta', 'red', 'green', 'yellow', 'blue', 'magenta', 'red', 'green', 'yellow', 'blue'];
        maxEsc = this.maxH(h);
        
        this.graphics.strokeStyle = 'black';
        this.drawLine(this.iX(0), this.iY(0), this.iX(9), this.iY(0));
        this.drawLine(this.iX(0), this.iY(0), this.iX(0), this.iY(7));
        
        let i = 0;
        for (let x = 0.25; x <= 9; x += 2.125) {
            this.drawLine(this.iX(x - 0.25), this.iY(0), this.iX(x), this.iY(0.5));
            this.drawLine(this.iX(x), this.iY(0.5), this.iX(x), this.iY(7));
            this.graphics.strokeText((maxEsc * i / 4) + "", this.iX(x - 0.4), this.iY(-0.3));
            i++;
        }
        
        let avance = (6 / (Math.max(h.length, 1) * 1.5));
        let yStart = 0.5;
        
        for (let ind = 0; ind < h.length; ind++) {
            let y = yStart + (ind * avance * 1.5);
            let valX = 8.5 * h[ind] / maxEsc;
            
            this.graphics.strokeStyle = colors[ind % colors.length];
            this.graphics.fillStyle = colors[ind % colors.length];
            
            this.drawBarra3d(
                this.iX(0), this.iY(y),
                this.iX(valX), this.iY(y),
                this.iX(valX + 0.5), this.iY(y + 0.25),
                this.iX(valX + 0.5), this.iY(y + avance + 0.25),
                this.iX(0.5), this.iY(y + avance + 0.25),
                this.iX(0), this.iY(y + avance),
                colors[ind % colors.length]
            );
            
            this.graphics.strokeStyle = 'black';
            this.drawLine(this.iX(0), this.iY(y), this.iX(valX), this.iY(y));
            this.drawLine(this.iX(valX), this.iY(y), this.iX(valX), this.iY(y + avance));
            this.drawLine(this.iX(0), this.iY(y), this.iX(0), this.iY(y + avance));
            this.drawLine(this.iX(0), this.iY(y + avance), this.iX(valX), this.iY(y + avance));
            
            this.drawLine(this.iX(valX), this.iY(y), this.iX(valX + 0.5), this.iY(y + 0.25));
            this.drawLine(this.iX(valX + 0.5), this.iY(y + 0.25), this.iX(valX + 0.5), this.iY(y + avance + 0.25));
            this.drawLine(this.iX(valX), this.iY(y + avance), this.iX(valX + 0.5), this.iY(y + avance + 0.25));
            
            this.drawLine(this.iX(0), this.iY(y + avance), this.iX(0.5), this.iY(y + avance + 0.25));
            this.drawLine(this.iX(0.5), this.iY(y + avance + 0.25), this.iX(valX + 0.5), this.iY(y + avance + 0.25));
        }
        
        for (let j = 0; j < h.length; j++) {
            this.graphics.strokeText("Valor: " + h[j], this.iX(10.5), this.iY(6 - j));
            this.graphics.fillStyle = colors[j % colors.length];
            this.graphics.fillRect(this.iX(10), this.iY(6 - j), 10, 10);
        }
    }
}
