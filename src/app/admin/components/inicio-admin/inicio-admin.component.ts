import { Component, OnInit } from '@angular/core';
import { InicioService, Feedback, Feedbackweb } from '../../services/inicio.service';
import * as Highcharts from 'highcharts';
//Comentario de prueba, borras despues

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.component.html',
  styleUrls: ['./inicio-admin.component.css']
})
export class InicioAdminComponent implements OnInit {
  productos: Feedback[] = [];
  productosweb: Feedbackweb[] = []; //web

  Highcharts: typeof Highcharts = Highcharts; // Referencia de Highcharts


  chartOptions: Highcharts.Options = {}; // Configuración del gráfico

  chartOptionsweb: Highcharts.Options = {}; //web

  constructor(private inicioService: InicioService) {}

  ngOnInit(): void {
    this.feedBacks();
    this.feedBacksweb();
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
  
    // Calcular el total de encuestas realizadas
    const totalEncuestas = this.productos.length;
  
    this.chartOptions = {
      chart: {
        type: 'column' // Tipo de gráfica
      },
      title: {
        text: 'PROMEDIO RESPUESTAS DEL SITIO MOVIL'
      },
      xAxis: {
        categories: [
          `Respuesta Uno<br>😍=${respuestaUnoConteo[3]} 🙂=${respuestaUnoConteo[2]} 🙁=${respuestaUnoConteo[1]}`,
          `Respuesta Dos<br>😍=${respuestaDosConteo[3]} 🙂=${respuestaDosConteo[2]} 🙁=${respuestaDosConteo[1]}`,
          `Respuesta Tres<br>😍=${respuestaTresConteo[3]} 🙂=${respuestaTresConteo[2]} 🙁=${respuestaTresConteo[1]}`
        ],
        labels: {
          useHTML: true // Permite usar HTML en las etiquetas
        }
      },
      yAxis: {
        title: {
          text: 'Promedio'
        }
      },
      series: [
        {
          type: 'column',
          name: `Total Encuestas: ${totalEncuestas}`,
          data: [
            { y: respuestaUno, color: this.obtenerColorPorPromedio(respuestaUno) },
            { y: respuestaDos, color: this.obtenerColorPorPromedio(respuestaDos) },
            { y: respuestaTres, color: this.obtenerColorPorPromedio(respuestaTres) }
          ]
        }
      ]
    };
  }

  calcularPromedio(respuesta: keyof Feedback): number {
    if (this.productos.length === 0) return 0;
  
    const total = this.productos.reduce((sum, item) => {
      // Convertir el valor a número
      const valor = Number(item[respuesta]);
      return sum + (isNaN(valor) ? 0 : valor); // Si no es un número válido, suma 0
    }, 0);
  
    return total / this.productos.length;
  }

  calcularConteos(respuesta: keyof Feedback): { [key in 1 | 2 | 3]: number } {
    const conteos: { [key in 1 | 2 | 3]: number } = { 1: 0, 2: 0, 3: 0 };
  
    this.productos.forEach((item) => {
      const valor = Number(item[respuesta]);
      if (valor === 1 || valor === 2 || valor === 3) {
        conteos[valor]++; // Ahora TypeScript reconoce que valor es una clave válida.
      }
    });
  
    return conteos;
  }

// para web 
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
  
    // Calcular el total de encuestas realizadas
    const totalEncuestas = this.productosweb.length;
  
    this.chartOptionsweb = {
      chart: {
        type: 'column' // Tipo de gráfica
      },
      title: {
        text: 'PROMEDIO RESPUESTAS DEL SITIO WEB'
      },
      xAxis: {
        categories: [
          `Respuesta Uno<br>😍=${respuestaUnoConteo[3]} 🙂=${respuestaUnoConteo[2]} 🙁=${respuestaUnoConteo[1]}`,
          `Respuesta Dos<br>😍=${respuestaDosConteo[3]} 🙂=${respuestaDosConteo[2]} 🙁=${respuestaDosConteo[1]}`,
          `Respuesta Tres<br>😍=${respuestaTresConteo[3]} 🙂=${respuestaTresConteo[2]} 🙁=${respuestaTresConteo[1]}`
        ],
        labels: {
          useHTML: true // Permite usar HTML en las etiquetas
        }
      },
      yAxis: {
        title: {
          text: 'Promedio'
        }
      },
      series: [
        {
          type: 'column',
          name: `Total Encuestas: ${totalEncuestas}`,
          data: [
            { y: respuestaUno, color: this.obtenerColorPorPromedio(respuestaUno) },
            { y: respuestaDos, color: this.obtenerColorPorPromedio(respuestaDos) },
            { y: respuestaTres, color: this.obtenerColorPorPromedio(respuestaTres) }
          ]
        }
      ]
    };
  }
  

  calcularPromedioweb(respuestaweb: keyof Feedbackweb): number {
    if (this.productosweb.length === 0) return 0;
  
    const total = this.productosweb.reduce((sum, item) => {
      // Convertir el valor a número
      const valor = Number(item[respuestaweb]);
      return sum + (isNaN(valor) ? 0 : valor); // Si no es un número válido, suma 0
    }, 0);
  
    return total / this.productosweb.length;
  }

  obtenerColorPorPromedio(promedio: number): string {
    if (promedio === 3) {
      return 'green'; // Verde
    } else if (promedio >= 2 && promedio < 3) {
      return 'orange'; // naranja
    } else if (promedio >= 1 && promedio < 2) {
      return 'red'; // Rojo
    }
    return 'gray'; // Color por defecto
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
  
}
