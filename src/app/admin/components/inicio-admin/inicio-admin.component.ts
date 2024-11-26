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

  //chartOptions: Highcharts.Options = {}; // Configuración del gráfico
  //chartOptionsweb: Highcharts.Options = {}; // Web

  chartOptionsPreguntaUno: Highcharts.Options= {};
  chartOptionsPreguntaDos: Highcharts.Options= {};
  chartOptionsPreguntaTres: Highcharts.Options= {};

  chartOptionswebPreguntaUno: Highcharts.Options= {};
  chartOptionswebPreguntaDos: Highcharts.Options= {};
  chartOptionswebPreguntaTres: Highcharts.Options= {};

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
    // Calculamos el conteo de respuestas para cada pregunta
    const respuestaUnoConteo = this.calcularConteos('respuestaUno');
    const respuestaDosConteo = this.calcularConteos('respuestaDos');
    const respuestaTresConteo = this.calcularConteos('respuestaTres');

    // Total de encuestas
    const totalEncuestas = this.productos.length;

    // Datos para las gráficas de pastel, agrupados por pregunta
    const datosPreguntaUno = [
        { name: '😍', y: respuestaUnoConteo[3], color: '#298d02' }, // Respuesta 3
        { name: '🙂', y: respuestaUnoConteo[2], color: '#ffa600' }, // Respuesta 2
        { name: '🙁', y: respuestaUnoConteo[1], color: '#ff0000' }, // Respuesta 1
    ];

    const datosPreguntaDos = [
        { name: '😍', y: respuestaDosConteo[3], color: '#298d02' }, // Respuesta 3
        { name: '🙂', y: respuestaDosConteo[2], color: '#ffa600' }, // Respuesta 2
        { name: '🙁', y: respuestaDosConteo[1], color: '#ff0000' }, // Respuesta 1
    ];

    const datosPreguntaTres = [
        { name: '😍', y: respuestaTresConteo[3], color: '#298d02' }, // Respuesta 3
        { name: '🙂', y: respuestaTresConteo[2], color: '#ffa600' }, // Respuesta 2
        { name: '🙁', y: respuestaTresConteo[1], color: '#ff0000' }, // Respuesta 1
    ];

    // Configuración para la primera gráfica
    this.chartOptionsPreguntaUno = {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Pregunta 1: ¿Consideras que los pasos para completar tu compra fueron claros?',
        },
        subtitle: {
            text: `Total de respuestas: ${totalEncuestas}`,
        },
        series: [
            {
                type: 'pie',
                name: 'Respuestas',
                data: datosPreguntaUno,
                innerSize: '50%',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y}',
                    style: {
                        fontSize: '14px',
                    },
                },
            },
        ],
    };

    // Configuración para la segunda gráfica
    this.chartOptionsPreguntaDos = {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Pregunta 2: ¿El diseño de la aplicación te resultó visualmente agradable?',
        },
        subtitle: {
            text: `Total de respuestas: ${totalEncuestas}`,
        },
        series: [
            {
                type: 'pie',
                name: 'Respuestas',
                data: datosPreguntaDos,
                innerSize: '50%',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y}',
                    style: {
                        fontSize: '14px',
                    },
                },
            },
        ],
    };

    // Configuración para la tercera gráfica
    this.chartOptionsPreguntaTres = {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Pregunta 3: ¿Te resultó conveniente el uso de esta aplicación?',
        },
        subtitle: {
            text: `Total de respuestas: ${totalEncuestas}`,
        },
        series: [
            {
                type: 'pie',
                name: 'Respuestas',
                data: datosPreguntaTres,
                innerSize: '50%',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y}',
                    style: {
                        fontSize: '14px',
                    },
                },
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
    // Calculamos los conteos de respuestas para cada pregunta
    const respuestaUnoConteo = this.calcularConteosweb('respuestaUno');
    const respuestaDosConteo = this.calcularConteosweb('respuestaDos');
    const respuestaTresConteo = this.calcularConteosweb('respuestaTres');
  
    // Total de encuestas para el sitio web
    const totalEncuestasWeb = this.productosweb.length;
  
    // Datos para las gráficas de pastel, agrupados por pregunta
    const datosPreguntaUno = [
      { name: '😍', y: respuestaUnoConteo[3], color: '#298d02' }, // Respuesta 3
      { name: '🙂', y: respuestaUnoConteo[2], color: '#ffa600' }, // Respuesta 2
      { name: '🙁', y: respuestaUnoConteo[1], color: '#ff0000' }, // Respuesta 1
    ];
  
    const datosPreguntaDos = [
      { name: '😍', y: respuestaDosConteo[3], color: '#298d02' }, // Respuesta 3
      { name: '🙂', y: respuestaDosConteo[2], color: '#ffa600' }, // Respuesta 2
      { name: '🙁', y: respuestaDosConteo[1], color: '#ff0000' }, // Respuesta 1
    ];
  
    const datosPreguntaTres = [
      { name: '😍', y: respuestaTresConteo[3], color: '#298d02' }, // Respuesta 3
      { name: '🙂', y: respuestaTresConteo[2], color: '#ffa600' }, // Respuesta 2
      { name: '🙁', y: respuestaTresConteo[1], color: '#ff0000' }, // Respuesta 1
    ];
  
    // Configuración para la primera gráfica
    this.chartOptionswebPreguntaUno = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Pregunta 1 (Web): ¿Consideras que los pasos para completar tu compra fueron claros?',
      },
      subtitle: {
        text: `Total de respuestas: ${totalEncuestasWeb}`,
    },
      series: [
        {
          type: 'pie',
          name: 'Respuestas',
          data: datosPreguntaUno,
          innerSize: '50%',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}',
            style: {
              fontSize: '14px',
            },
          },
        },
      ],
    };
  
    // Configuración para la segunda gráfica
    this.chartOptionswebPreguntaDos = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Pregunta 2 (Web): ¿El diseño del sitio web te resultó visualmente agradable?',
      },
      subtitle: {
        text: `Total de respuestas: ${totalEncuestasWeb}`,
    },
      series: [
        {
          type: 'pie',
          name: 'Respuestas',
          data: datosPreguntaDos,
          innerSize: '50%',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}',
            style: {
              fontSize: '14px',
            },
          },
        },
      ],
    };
  
    // Configuración para la tercera gráfica
    this.chartOptionswebPreguntaTres = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Pregunta 3 (Web): ¿Te resultó conveniente el uso del sitio web?',
      },
      subtitle: {
        text: `Total de respuestas: ${totalEncuestasWeb}`,
    },
      series: [
        {
          type: 'pie',
          name: 'Respuestas',
          data: datosPreguntaTres,
          innerSize: '50%',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}',
            style: {
              fontSize: '14px',
            },
          },
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
    if (promedio >= 2.5 || promedio == 3) return 'green'; // Verde: 3 a 2.5
    if (promedio < 2.5 && promedio >= 1.5) return 'orange'; // Naranja: Menos de 2.5 a 1.5
    if (promedio < 1.5) return 'red'; // Rojo: Menos de 1.5
    return 'gray'; // Por defecto: Gris para valores fuera de rango
  }
}