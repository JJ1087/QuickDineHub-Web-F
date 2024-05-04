import { Component } from '@angular/core';

@Component({
  selector: 'app-historial-repartidor',
  templateUrl: './historial-repartidor.component.html',
  styleUrl: './historial-repartidor.component.css'
})
export class HistorialRepartidorComponent {
  ventas = [
    {
      producto: 'Ensalada',
      restaurante: 'La cazuela',
      cantidad: 2,
      costoTotal: '$200',
      fechaVenta: '22/11/2023',
      direccionEntrega: 'Colonia...Calle...'
    },
    {
      producto: 'Mole',
      restaurante: 'Rosseta',
      cantidad: 1,
      costoTotal: '$150',
      fechaVenta: '22/11/2023',
      direccionEntrega: 'Colonia...Calle...'
    },
    {
      producto: 'Pollo con verduras',
      restaurante: 'La docena',
      cantidad: 3,
      costoTotal: '$400',
      fechaVenta: '21/11/2023',
      direccionEntrega: 'Colonia...Calle...'
    },
    {
      producto: 'Pizza mexicana grande',
      restaurante: 'La italiana',
      cantidad: 1,
      costoTotal: '$450',
      fechaVenta: '21/11/2023',
      direccionEntrega: 'Colonia...Calle...'
    },
    {
      producto: 'Pollo con verduras',
      restaurante: 'La docena',
      cantidad: 1,
      costoTotal: '$120',
      fechaVenta: '20/11/2023',
      direccionEntrega: 'Colonia...Calle...'
    }
    // Agrega más ventas según sea necesario
  ];
}
