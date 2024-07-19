import { Component } from '@angular/core';

@Component({
  selector: 'app-rep-entregas',
  templateUrl: './rep-entregas.component.html',
  styleUrl: './rep-entregas.component.css'
})
export class RepEntregasComponent {

  // Método para confirmar la entrega
  confirmOrder(event: Event) {
    const confirmation = confirm('¿Estás seguro de confirmar la entrega?');
    if (confirmation) {
      // Lógica para manejar la confirmación de la entrega
      // Por ejemplo, podrías hacer una llamada a un servicio para actualizar el estado del pedido
      console.log('Orden confirmada');
      // Puedes también eliminar el pedido si lo deseas
      this.removeOrder(event);
    }
  }

  // Método para eliminar el pedido (opcional)
  removeOrder(event: Event) {
    const button = event.target as HTMLButtonElement;
    const orderItem = button.closest('.order-item');
    if (orderItem) {
      orderItem.remove();
    }
  }
}
