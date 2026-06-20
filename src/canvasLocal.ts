export class CanvasLocal {
  protected graphics: CanvasRenderingContext2D;
  protected rWidth: number;
  protected rHeight: number;
  protected maxX: number;
  protected maxY: number;
  protected pixelSize: number;
  protected centerX: number;
  protected centerY: number;

  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.graphics = g;
    this.maxX = canvas.width - 1;
    this.maxY = canvas.height - 1;
    this.centerX = this.maxX / 2;
    this.centerY = this.maxY / 2;
    this.rWidth = 10; 
    this.rHeight = 10;
    this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
  }

  private iY(y: number): number { return Math.round(this.centerY - y / this.pixelSize); }

  public setZoom(factor: number) {
    this.rWidth *= factor;
    this.rHeight *= factor;
    this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
  }

  public paint(expression: string) {
    this.graphics.clearRect(0, 0, this.maxX + 1, this.maxY + 1);

    // Dibujo de Ejes (Negro)
    this.graphics.strokeStyle = '#000';
    this.graphics.lineWidth = 1;
    this.graphics.beginPath();
    this.graphics.moveTo(0, this.centerY); this.graphics.lineTo(this.maxX, this.centerY); // X
    this.graphics.moveTo(this.centerX, 0); this.graphics.lineTo(this.centerX, this.maxY); // Y
    this.graphics.stroke();

    // Dibujo de la Función (Rojo)
    this.graphics.strokeStyle = 'red';
    this.graphics.lineWidth = 2;
    let first = true;

    this.graphics.beginPath();
    for (let i = 0; i <= this.maxX; i++) {
        const xMath = (i - this.centerX) * this.pixelSize; 
        try {
            // Usamos una expresión regular para reemplazar solo la 'x' como variable
            const cleanExpr = expression.replace(/\bx\b/g, `(${xMath})`);
            const funcRes = eval(cleanExpr);
            const py = this.iY(funcRes);

            if (isFinite(py)) {
                if (first) {
                    this.graphics.moveTo(i, py);
                    first = false;
                } else {
                    this.graphics.lineTo(i, py);
                }
            }
        } catch (e) { continue; }
    }
    this.graphics.stroke();
  }
}
