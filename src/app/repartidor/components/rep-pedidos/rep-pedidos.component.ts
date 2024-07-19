import { Component } from '@angular/core';

@Component({
  selector: 'app-rep-pedidos',
  templateUrl: './rep-pedidos.component.html',
  styleUrl: './rep-pedidos.component.css'
})
export class RepPedidosComponent {
  orders = [
    { 
      customerName: 'Miguel Lara Hernandez',
      item1: 'Pollo empanizado x1',
      item2: 'Refresco Coca-Cola 600 ml. x1',
      deliveryAddress: 'Calle Allende, Colonia Tahuizan #13',
      distance: 'X km',
      date: '20/11/2023',
      orderNumber: 1,
      isAccepted: false
    },
    { 
      customerName: 'Miguel Lara Hernandez',
      item1: 'Pollo empanizado x1',
      item2: 'Refresco Coca-Cola 600 ml. x1',
      deliveryAddress: 'Calle Allende, Colonia Tahuizan #13',
      distance: 'X km',
      date: '20/11/2023',
      orderNumber: 2,
      isAccepted: false
    },
    { 
      customerName: 'Miguel Lara Hernandez',
      item1: 'Pollo empanizado x1',
      item2: 'Refresco Coca-Cola 600 ml. x1',
      deliveryAddress: 'Calle Allende, Colonia Tahuizan #13',
      distance: 'X km',
      date: '20/11/2023',
      orderNumber: 3,
      isAccepted: false
    }
    // Otros pedidos...
  ];

  acceptOrder(order: any) {
    order.isAccepted = true;
    // Aquí podrías hacer una llamada al servidor para actualizar el estado del pedido
  }

  rejectOrder(order: any) {
    // Aquí podrías hacer una llamada al servidor para marcar el pedido como rechazado
    const index = this.orders.indexOf(order);
    if (index > -1) {
      this.orders.splice(index, 1);
    }
  }

  completeOrder(order: any) {
    // Aquí podrías hacer una llamada al servidor para marcar el pedido como completado
    const index = this.orders.indexOf(order);
    if (index > -1) {
      this.orders.splice(index, 1); // Elimina la orden completada
    }
  }
}
