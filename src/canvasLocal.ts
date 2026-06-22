export interface Vertice3D {
  id: number;
  x: number;
  y: number;
  z: number;
  pieza: string;
}

export interface Arista3D {
  a: number;
  b: number;
  pieza: string;
}

interface Punto3D {
  x: number;
  y: number;
  z: number;
}

interface Punto2D {
  x: number;
  y: number;
  z: number;
}

export class CanvasLocal {

  private graphics: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  private vertices: Vertice3D[] = [];
  private aristas: Arista3D[] = [];

  private zoom: number = 1;
  private anguloVistaX: number = -20 * Math.PI / 180;
  private anguloVistaY: number = -30 * Math.PI / 180;

  private anguloBrazoInferior: number = 0;
  private anguloBrazoSuperior: number = 0;
  private anguloCabeza: number = 0;
  private anguloLampara: number = 0;

  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.graphics = g;
    this.canvas = canvas;
  }

  public setModelo(vertices: Vertice3D[], aristas: Arista3D[]): void {
    this.vertices = vertices;
    this.aristas = aristas;
    this.dibujar();
  }

  public dibujarMensaje(titulo: string, subtitulo: string): void {
    this.limpiarCanvas();

    this.graphics.fillStyle = '#f8f9fa';
    this.graphics.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.graphics.strokeStyle = '#cccccc';
    this.graphics.lineWidth = 1;
    this.graphics.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40);

    this.graphics.fillStyle = '#333333';
    this.graphics.font = '22px Arial';
    this.graphics.textAlign = 'center';
    this.graphics.fillText(titulo, this.canvas.width / 2, this.canvas.height / 2 - 20);

    this.graphics.font = '16px Arial';
    this.graphics.fillText(subtitulo, this.canvas.width / 2, this.canvas.height / 2 + 15);
  }

  public rotarVista(deltaX: number, deltaY: number): void {
    this.anguloVistaY += deltaX * 0.01;
    this.anguloVistaX += deltaY * 0.01;
    this.dibujar();
  }

  public cambiarZoom(delta: number): void {
    this.zoom += delta;

    if (this.zoom < 0.4) {
      this.zoom = 0.4;
    }

    if (this.zoom > 3) {
      this.zoom = 3;
    }

    this.dibujar();
  }

  public moverPieza(pieza: string, grados: number): void {
    const radianes = grados * Math.PI / 180;

    if (pieza === 'brazo_inferior') {
      this.anguloBrazoInferior += radianes;
    }

    if (pieza === 'brazo_superior') {
      this.anguloBrazoSuperior += radianes;
    }

    if (pieza === 'cabeza') {
      this.anguloCabeza += radianes;
    }

    if (pieza === 'lampara') {
      this.anguloLampara += radianes;
    }

    this.dibujar();
  }

  public reiniciar(): void {
    this.zoom = 1;
    this.anguloVistaX = -20 * Math.PI / 180;
    this.anguloVistaY = -30 * Math.PI / 180;

    this.anguloBrazoInferior = 0;
    this.anguloBrazoSuperior = 0;
    this.anguloCabeza = 0;
    this.anguloLampara = 0;

    this.dibujar();
  }

  public dibujar(): void {
    this.limpiarCanvas();

    if (this.vertices.length === 0 || this.aristas.length === 0) {
      this.dibujarMensaje(
        'Proyecto Final: Lámpara 3D',
        'Carga el archivo lampara.dat para dibujar el modelo.'
      );
      return;
    }

    const puntos3D = this.obtenerPuntosTransformados();
    const centro = this.calcularCentro(puntos3D);
    const puntos2D = this.proyectarPuntos(puntos3D, centro);

    this.dibujarFondo();
    this.dibujarAristas(puntos2D);
    this.dibujarVertices(puntos2D);
    this.dibujarInstrucciones();
  }

  private limpiarCanvas(): void {
    this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private dibujarFondo(): void {
    this.graphics.fillStyle = '#f8f9fa';
    this.graphics.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.graphics.strokeStyle = '#dddddd';
    this.graphics.lineWidth = 1;
    this.graphics.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40);
  }

  private obtenerPuntosTransformados(): { [id: number]: Punto3D } {
    const puntos: { [id: number]: Punto3D } = {};

    for (const vertice of this.vertices) {
      puntos[vertice.id] = this.transformarPieza(vertice);
    }

    return puntos;
  }

  private transformarPieza(vertice: Vertice3D): Punto3D {
    let punto: Punto3D = {
      x: vertice.x,
      y: vertice.y,
      z: vertice.z
    };

    const piezasBrazoInferior = [
      'brazo_inferior',
      'eje_2',
      'brazo_superior',
      'cabeza',
      'foco'
    ];

    const piezasBrazoSuperior = [
      'brazo_superior',
      'cabeza',
      'foco'
    ];

    const piezasCabeza = [
      'cabeza',
      'foco'
    ];

    const pivoteBrazoInferior: Punto3D = {
      x: 0,
      y: 1,
      z: 0
    };

    if (piezasBrazoInferior.indexOf(vertice.pieza) >= 0) {
      punto = this.rotarZ(punto, pivoteBrazoInferior, this.anguloBrazoInferior);
    }

    let pivoteBrazoSuperior: Punto3D = {
      x: 0.8,
      y: 3.6,
      z: 0
    };

    pivoteBrazoSuperior = this.rotarZ(
      pivoteBrazoSuperior,
      pivoteBrazoInferior,
      this.anguloBrazoInferior
    );

    if (piezasBrazoSuperior.indexOf(vertice.pieza) >= 0) {
      punto = this.rotarZ(punto, pivoteBrazoSuperior, this.anguloBrazoSuperior);
    }

    let pivoteCabeza: Punto3D = {
      x: 2.8,
      y: 4.6,
      z: 0
    };

    pivoteCabeza = this.rotarZ(
      pivoteCabeza,
      pivoteBrazoInferior,
      this.anguloBrazoInferior
    );

    pivoteCabeza = this.rotarZ(
      pivoteCabeza,
      pivoteBrazoSuperior,
      this.anguloBrazoSuperior
    );

    if (piezasCabeza.indexOf(vertice.pieza) >= 0) {
      punto = this.rotarZ(punto, pivoteCabeza, this.anguloCabeza);
    }

    punto = this.rotarY(punto, { x: 0, y: 0, z: 0 }, this.anguloLampara);

    return punto;
  }

  private calcularCentro(puntos: { [id: number]: Punto3D }): Punto3D {
    const lista = this.vertices.map(vertice => puntos[vertice.id]);

    let minX = lista[0].x;
    let maxX = lista[0].x;
    let minY = lista[0].y;
    let maxY = lista[0].y;
    let minZ = lista[0].z;
    let maxZ = lista[0].z;

    for (const punto of lista) {
      if (punto.x < minX) minX = punto.x;
      if (punto.x > maxX) maxX = punto.x;

      if (punto.y < minY) minY = punto.y;
      if (punto.y > maxY) maxY = punto.y;

      if (punto.z < minZ) minZ = punto.z;
      if (punto.z > maxZ) maxZ = punto.z;
    }

    return {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      z: (minZ + maxZ) / 2
    };
  }

  private proyectarPuntos(
    puntos: { [id: number]: Punto3D },
    centro: Punto3D
  ): { [id: number]: Punto2D } {

    const proyectados: { [id: number]: Punto2D } = {};
    const escala = 85 * this.zoom;

    for (const vertice of this.vertices) {
      let punto: Punto3D = puntos[vertice.id];

      punto = {
        x: punto.x - centro.x,
        y: punto.y - centro.y,
        z: punto.z - centro.z
      };

      punto = this.rotarXOrigen(punto, this.anguloVistaX);
      punto = this.rotarYOrigen(punto, this.anguloVistaY);

      proyectados[vertice.id] = {
        x: this.canvas.width / 2 + punto.x * escala,
        y: this.canvas.height / 2 - punto.y * escala,
        z: punto.z
      };
    }

    return proyectados;
  }

  private dibujarAristas(puntos: { [id: number]: Punto2D }): void {
    const aristasOrdenadas = this.aristas.slice().sort((a, b) => {
      const za = (puntos[a.a].z + puntos[a.b].z) / 2;
      const zb = (puntos[b.a].z + puntos[b.b].z) / 2;
      return za - zb;
    });

    for (const arista of aristasOrdenadas) {
      const p1 = puntos[arista.a];
      const p2 = puntos[arista.b];

      if (!p1 || !p2) {
        continue;
      }

      this.graphics.beginPath();
      this.graphics.strokeStyle = this.colorPieza(arista.pieza);
      this.graphics.lineWidth = 2;
      this.graphics.moveTo(p1.x, p1.y);
      this.graphics.lineTo(p2.x, p2.y);
      this.graphics.stroke();
      this.graphics.closePath();
    }
  }

  private dibujarVertices(puntos: { [id: number]: Punto2D }): void {
    for (const vertice of this.vertices) {
      const punto = puntos[vertice.id];

      if (!punto) {
        continue;
      }

      this.graphics.beginPath();
      this.graphics.fillStyle = '#333333';
      this.graphics.arc(punto.x, punto.y, 3, 0, Math.PI * 2);
      this.graphics.fill();
      this.graphics.closePath();
    }
  }

  private dibujarInstrucciones(): void {
    this.graphics.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.graphics.fillRect(30, 30, 300, 70);

    this.graphics.fillStyle = '#333333';
    this.graphics.font = '14px Arial';
    this.graphics.textAlign = 'left';
    this.graphics.fillText('Arrastra con el cursor para rotar.', 45, 55);
    this.graphics.fillText('Usa la rueda del mouse para hacer zoom.', 45, 78);
  }

  private colorPieza(pieza: string): string {
    const colores: { [pieza: string]: string } = {
      base: '#212529',
      eje_1: '#6c757d',
      brazo_inferior: '#0d6efd',
      eje_2: '#6c757d',
      brazo_superior: '#198754',
      cabeza: '#dc3545',
      foco: '#ffc107'
    };

    return colores[pieza] || '#000000';
  }

  private rotarXOrigen(punto: Punto3D, angulo: number): Punto3D {
    const cos = Math.cos(angulo);
    const sin = Math.sin(angulo);

    return {
      x: punto.x,
      y: punto.y * cos - punto.z * sin,
      z: punto.y * sin + punto.z * cos
    };
  }

  private rotarYOrigen(punto: Punto3D, angulo: number): Punto3D {
    const cos = Math.cos(angulo);
    const sin = Math.sin(angulo);

    return {
      x: punto.x * cos + punto.z * sin,
      y: punto.y,
      z: -punto.x * sin + punto.z * cos
    };
  }

  private rotarY(punto: Punto3D, pivote: Punto3D, angulo: number): Punto3D {
    const cos = Math.cos(angulo);
    const sin = Math.sin(angulo);

    const x = punto.x - pivote.x;
    const z = punto.z - pivote.z;

    return {
      x: pivote.x + x * cos + z * sin,
      y: punto.y,
      z: pivote.z - x * sin + z * cos
    };
  }

  private rotarZ(punto: Punto3D, pivote: Punto3D, angulo: number): Punto3D {
    const cos = Math.cos(angulo);
    const sin = Math.sin(angulo);

    const x = punto.x - pivote.x;
    const y = punto.y - pivote.y;

    return {
      x: pivote.x + x * cos - y * sin,
      y: pivote.y + x * sin + y * cos,
      z: punto.z
    };
  }
}