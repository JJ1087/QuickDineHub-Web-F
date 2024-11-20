import { Component, OnInit } from '@angular/core';
import { InicioService, Feedback } from '../../services/inicio.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.component.html',
  styleUrls: ['./inicio-admin.component.css']
})
export class InicioAdminComponent implements OnInit {
  productos: Feedback[] = [];
  Highcharts: typeof Highcharts = Highcharts; // Referencia de Highcharts
  chartOptions: Highcharts.Options = {}; // Configuración del gráfico

  constructor(private inicioService: InicioService) {}

  ngOnInit(): void {
    this.feedBacks();
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

    this.chartOptions = {
      chart: {
        type: 'column' // Tipo de gráfica
      },
      title: {
        text: 'Promedio de Respuestas'
      },
      xAxis: {
        categories: ['Respuesta Uno', 'Respuesta Dos', 'Respuesta Tres']
      },
      yAxis: {
        title: {
          text: 'Promedio'
        }
      },
      series: [
        {
          type: 'column',
          name: 'Promedio',
          data: [respuestaUno, respuestaDos, respuestaTres]
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
  
}
