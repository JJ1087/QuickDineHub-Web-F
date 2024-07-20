import { Component } from '@angular/core';

@Component({
  selector: 'app-cli-ofertas',
  templateUrl: './cli-ofertas.component.html',
  styleUrl: './cli-ofertas.component.css'
})
export class CliOfertasComponent {

  ofertas = [
    {
      titulo: 'Oferta Especial 1',
      descripcion: 'Descripción detallada de la oferta especial. Aprovecha esta increíble oferta limitada.',
      categoria: 'Categoría 1',
      precioOriginal: 79.99,
      descuento: '-20%',
      precioOferta: 63.99,
      imagen: 'assets/Espagueti.jpg'
    },
    {
      titulo: 'Oferta Especial 2',
      descripcion: 'Descripción detallada de la oferta especial. Aprovecha esta increíble oferta limitada.',
      categoria: 'Categoría 2',
      precioOriginal: 49.99,
      descuento: '-15%',
      precioOferta: 42.49,
      imagen: 'assets/Frappe.jpg'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
