import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { InicioService, Feedback, Feedbackweb } from '../../services/inicio.service';

import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.component.html',
  styleUrls: ['./inicio-admin.component.css']
})
export class InicioAdminComponent implements OnInit {
  productos: Feedback[] = [];
  productosweb: Feedbackweb[] = []; // Web

  Highcharts: typeof Highcharts = Highcharts;// Referencia de Highcharts

  chartOptions: Highcharts.Options = {}; // Configuración del gráfico
  chartOptionsweb: Highcharts.Options = {}; // Web

  constructor(
    private inicioService: InicioService,
    @Inject(PLATFORM_ID) private platformId: Object // Detecta el entorno
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Ejecutando funciones para el navegador...');
      this.feedBacks();
      this.feedBacksweb();
      this.configurarGrafica(); // Asegúrate de inicializar el gráfico aquí
      this.configurarGraficaweb(); // Web
    } else {
      console.warn('El entorno actual no es un navegador.');
    }
  }

  feedBacks(): void {
    this.inicioService.obtenerFeedbacks().subscribe(
      (productos: Feedback[]) => {
        this.productos = productos;
        console.log('Feedbacks: ', this.productos);
        this.configurarGrafica(); // Configurar la gráfica después de obtener los datos
      },
      (error) => {
        console.error('Error al obtener los feedbacks:', error);
      }
    );
  }

  configurarGrafica(): void {
    const respuestaUno = this.calcularPromedio('respuestaUno');
    const respuestaDos = this.calcularPromedio('respuestaDos');
    const respuestaTres = this.calcularPromedio('respuestaTres');
  
    const respuestaUnoConteo = this.calcularConteos('respuestaUno');
    const respuestaDosConteo = this.calcularConteos('respuestaDos');
    const respuestaTresConteo = this.calcularConteos('respuestaTres');
  
    const totalEncuestas = this.productos.length;
  
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'PROMEDIO RESPUESTAS DEL SITIO MÓVIL',
      },
      xAxis: {
        categories: ['😍', '🙂', '🙁'], // Solo los emojis debajo
        labels: {
          useHTML: true,
          formatter: function () {
            const emojis = [
              `😍=${respuestaUnoConteo[3]} 🙂=${respuestaUnoConteo[2]} 🙁=${respuestaUnoConteo[1]}`,
              `😍=${respuestaDosConteo[3]} 🙂=${respuestaDosConteo[2]} 🙁=${respuestaDosConteo[1]}`,
              `😍=${respuestaTresConteo[3]} 🙂=${respuestaTresConteo[2]} 🙁=${respuestaTresConteo[1]}`,
            ];
            return `<span style="font-size:14px;">${emojis[this.pos]}</span>`;
          },
          align: 'center',
          style: {
            fontSize: '14px',
          },
        },
      },
      yAxis: {
        title: {
          text: 'Promedio',
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              const preguntas = [
                '¿Consideras que los pasos para completar tu compra fueron claros?',
                '¿El diseño de la aplicación te resultó visualmente agradable?',
                '¿Te resultó conveniente el uso de esta aplicación?',
              ];
              const index = this.point?.index ?? 0; // Si `index` es null, usar 0
              return `<div style="text-align: center; font-size: 12px;">
                        <strong>${preguntas[index]}</strong>
                      </div>`;
            },
            useHTML: true,
            style: {
              fontSize: '14px',
              color: '#000',
            },
          },
        },
      },
      series: [
        {
          type: 'column',
          name: `Total Encuestas: ${totalEncuestas}`,
          data: [
            { y: respuestaUno, color: this.obtenerColorPorPromedio(respuestaUno) },
            { y: respuestaDos, color: this.obtenerColorPorPromedio(respuestaDos) },
            { y: respuestaTres, color: this.obtenerColorPorPromedio(respuestaTres) },
          ],
        },
      ],
    };
  }
  
  feedBacksweb(): void {
    this.inicioService.obtenerFeedbacksweb().subscribe(
      (productosweb: Feedbackweb[]) => {
        this.productosweb = productosweb;
        console.log('Feedbacksweb: ', this.productosweb);
        this.configurarGraficaweb(); // Configurar la gráfica después de obtener los datos
      },
      (error) => {
        console.error('Error al obtener los feedbacksweb:', error);
      }
    );
  }

  configurarGraficaweb(): void {
    const respuestaUno = this.calcularPromedioweb('respuestaUno');
    const respuestaDos = this.calcularPromedioweb('respuestaDos');
    const respuestaTres = this.calcularPromedioweb('respuestaTres');
  
    const respuestaUnoConteo = this.calcularConteosweb('respuestaUno');
    const respuestaDosConteo = this.calcularConteosweb('respuestaDos');
    const respuestaTresConteo = this.calcularConteosweb('respuestaTres');
  
    const totalEncuestas = this.productosweb.length;
  
    this.chartOptionsweb = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'PROMEDIO RESPUESTAS DEL SITIO WEB',
      },
      xAxis: {
        categories: ['😍', '🙂', '🙁'], // Solo emojis en el eje X
        labels: {
          useHTML: true,
          formatter: function () {
            const emojis = [
              `😍=${respuestaUnoConteo[3]} 🙂=${respuestaUnoConteo[2]} 🙁=${respuestaUnoConteo[1]}`,
              `😍=${respuestaDosConteo[3]} 🙂=${respuestaDosConteo[2]} 🙁=${respuestaDosConteo[1]}`,
              `😍=${respuestaTresConteo[3]} 🙂=${respuestaTresConteo[2]} 🙁=${respuestaTresConteo[1]}`,
            ];
            return `<span style="font-size:14px;">${emojis[this.pos]}</span>`;
          },
          align: 'center',
          style: {
            fontSize: '14px',
          },
        },
      },
      yAxis: {
        title: {
          text: 'Promedio',
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              const preguntas = [
                '¿Consideras que los pasos para completar tu compra fueron claros?',
                '¿El diseño de la aplicación te resultó visualmente agradable?',
                '¿Te resultó conveniente el uso de esta aplicación?',
              ];
              const index = this.point?.index ?? 0; // Si `index` es null, usar 0
              return `<div style="text-align: center; font-size: 12px;">
                        <strong>${preguntas[index]}</strong>
                      </div>`;
            },
            useHTML: true,
            style: {
              fontSize: '14px',
              color: '#000',
            },
          },
        },
      },
      series: [
        {
          type: 'column',
          name: `Total Encuestas: ${totalEncuestas}`,
          data: [
            { y: respuestaUno, color: this.obtenerColorPorPromedio(respuestaUno) },
            { y: respuestaDos, color: this.obtenerColorPorPromedio(respuestaDos) },
            { y: respuestaTres, color: this.obtenerColorPorPromedio(respuestaTres) },
          ],
        },
      ],
    };
  }
  
  calcularPromedio(respuesta: keyof Feedback): number {
    if (this.productos.length === 0) return 0;

    const total = this.productos.reduce((sum, item) => {
      const valor = Number(item[respuesta]);
      return sum + (isNaN(valor) ? 0 : valor);
    }, 0);

    return total / this.productos.length;
  }

  calcularConteos(respuesta: keyof Feedback): { [key in 1 | 2 | 3]: number } {
    const conteos: { [key in 1 | 2 | 3]: number } = { 1: 0, 2: 0, 3: 0 };

    this.productos.forEach((item) => {
      const valor = Number(item[respuesta]);
      if (valor === 1 || valor === 2 || valor === 3) {
        conteos[valor]++;
      }
    });

    return conteos;
  }

  calcularPromedioweb(respuestaweb: keyof Feedbackweb): number {
    if (this.productosweb.length === 0) return 0;

    const total = this.productosweb.reduce((sum, item) => {
      const valor = Number(item[respuestaweb]);
      return sum + (isNaN(valor) ? 0 : valor);
    }, 0);

    return total / this.productosweb.length;
  }

  calcularConteosweb(respuestaweb: keyof Feedbackweb): { [key in 1 | 2 | 3]: number } {
    const conteos: { [key in 1 | 2 | 3]: number } = { 1: 0, 2: 0, 3: 0 };

    this.productosweb.forEach((item) => {
      const valor = Number(item[respuestaweb]);
      if (valor === 1 || valor === 2 || valor === 3) {
        conteos[valor]++;
      }
    });

    return conteos;
  }

  obtenerColorPorPromedio(promedio: number): string {
    if (promedio === 3) return 'green';
    if (promedio >= 2) return 'orange';
    if (promedio >= 1) return 'red';
    return 'gray';
  }
}