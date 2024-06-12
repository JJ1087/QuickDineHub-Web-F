import { Component } from '@angular/core';

@Component({
  selector: 'app-resenas-restaurante',
  templateUrl: './resenas-restaurante.component.html',
  styleUrl: './resenas-restaurante.component.css'
})
export class ResenasRestauranteComponent {
  resenas = [
    {
      usuario: 'Nombre del Usuario 1',
      resena: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      calificacion: 4,
      estrellas: '★★★★☆'
    },
    {
      usuario: 'Nombre del Usuario 2',
      resena: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      calificacion: 5,
      estrellas: '★★★★★'
    }
    // Agrega más reseñas según sea necesario
  ];
}
