/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';

@Component({
  selector: 'app-admn-pagos',
  templateUrl: './admn-pagos.component.html',
  styleUrl: './admn-pagos.component.css'
})
export class AdmnPagosComponent {
  repartidores = [
    { nombre: 'Juan Pérez', perfil: 'Repartidor', monto: 500, fecha: new Date('2024-07-15') },
    { nombre: 'Ana Gómez', perfil: 'Repartidor', monto: 700, fecha: new Date('2024-07-16') }
];

restaurantes = [
    { nombre: 'El Buen Sabor', perfil: 'Restaurante', monto: 1000, fecha: new Date('2024-07-17') },
    { nombre: 'La Casa del Taco', perfil: 'Restaurante', monto: 1200, fecha: new Date('2024-07-18') }
];

constructor() { }

ngOnInit(): void { }

pagar(persona: any): void {
    // Lógica para realizar el pago
    console.log('Pagando a', persona.nombre);
}
}
