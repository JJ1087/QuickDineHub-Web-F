import { Component, OnInit  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthrestauranteService } from '../../services/authrestaurante.service';


@Component({
  selector: 'app-ventas-restaurante',
  templateUrl: './ventas-restaurante.component.html',
  styleUrl: './ventas-restaurante.component.css'
})

export class VentasRestauranteComponent implements OnInit {
  restauranteId: string | null = null;
  folioCounter: string = '1';
  editedProduct = '';
  editedQuantity = '';
  editedTotalCost = '';
  editedSaleDate = '';
  editedSaleLocation = '';
  sortBy: string = 'folio';
  sortOrder: string = 'asc';
  private synth!: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  compras: any[] = [];

  constructor(public dialog: MatDialog, private authRestauranteService: AuthrestauranteService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const restaurantId = localStorage.getItem('RESTAURANT_ID');
      if (restaurantId) {
        this.restauranteId = restaurantId;
        this.getCompras();
      } else {
        console.error("No se encontró 'RESTAURANT_ID' en localStorage.");
      }
    }
  }

  toggleVozAlta(): void {
    const enableVozAlta = document.getElementById('enableVozAlta') as HTMLInputElement;
    this.synth = window.speechSynthesis;

    const elementos = document.querySelectorAll('.sales-table, .admin-menu a');
    elementos.forEach(element => {
      if (enableVozAlta.checked) {
        element.addEventListener('mouseover', this.handleMouseOver);
      } else {
        element.removeEventListener('mouseover', this.handleMouseOver);
      }
    });
  }

  handleMouseOver = (event: Event) => {
    const target = event.target as HTMLElement;
    if (this.utterance) {
      this.synth.cancel();
    }
    const text = target.textContent || target.getAttribute('alt') || target.getAttribute('aria-label') || '';
    if (text) {
      this.utterance = new SpeechSynthesisUtterance(text);
      this.synth.speak(this.utterance);
    }
  };

  getCompras(): void {
    if (this.restauranteId) {
      this.authRestauranteService.obtenerComprasPorRestaurante(this.restauranteId).subscribe({
        next: (response: any) => {
          this.compras = response.map((compra: any, index: number) => ({
            ...compra,
            precioTotal: parseFloat(compra.precioTotal.$numberDecimal),
            fechaHoraEntrega: new Date(compra.fechaHoraEntrega),
            folio: index + 1 // Calcula el folio basado en el índice
          }));
          this.folioCounter = (this.compras.length + 1).toString(); // Actualiza el folioCounter
        },
        error: (error: any) => {
          console.error('Error al obtener las compras:', error);
        }
      });
    }
  }

  filterTable(): void {
    const input = document.getElementById('search') as HTMLInputElement;
    const input2 = document.getElementById('search2') as HTMLInputElement;
    const input3 = document.getElementById('search3') as HTMLInputElement;
    const input4 = document.getElementById('search4') as HTMLInputElement;

    const filter = input.value.toUpperCase();
    const filter2 = input2.value.toUpperCase();
    const filter3 = input3.value.toUpperCase();
    const filter4 = input4.value.toUpperCase();

    const selectColumn = document.getElementById('searchColumn') as HTMLSelectElement;
    const selectColumn2 = document.getElementById('searchColumn2') as HTMLSelectElement;
    const selectColumn3 = document.getElementById('searchColumn3') as HTMLSelectElement;
    const selectColumn4 = document.getElementById('searchColumn4') as HTMLSelectElement;

    const table = document.getElementById('salesTable') as HTMLTableElement;
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName('td')[selectColumn.selectedIndex];
      let td2 = tr[i].getElementsByTagName('td')[selectColumn2.selectedIndex];
      let td3 = tr[i].getElementsByTagName('td')[selectColumn3.selectedIndex];
      let td4 = tr[i].getElementsByTagName('td')[selectColumn4.selectedIndex];

      if (td && td2 && td3 && td4) {
        const txtValue = td.textContent || td.innerText || '';
        const txtValue2 = td2.textContent || td2.innerText || '';
        const txtValue3 = td3.textContent || td3.innerText || '';
        const txtValue4 = td4.textContent || td4.innerText || '';

        tr[i].style.display =
          (txtValue.toUpperCase().indexOf(filter) > -1 || filter === '') &&
          (txtValue2.toUpperCase().indexOf(filter2) > -1 || filter2 === '') &&
          (txtValue3.toUpperCase().indexOf(filter3) > -1 || filter3 === '') &&
          (txtValue4.toUpperCase().indexOf(filter4) > -1 || filter4 === '')
            ? ''
            : 'none';
      }
    }
  }

  toggleAddSaleForm(): void {
    const form = document.getElementById('addSaleForm');
    if (form) {
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
  }

  addSale(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const newSale = {
      nombreProducto: form['product'].value,
      cantidadProducto: form['quantity'].value,
      precioTotal: parseFloat(form['totalCost'].value),
      fechaHoraEntrega: new Date(form['saleDate'].value),
      direccion: form['saleLocation'].value,
      folio: this.folioCounter // Asigna el folio actual
    };

    this.authRestauranteService.agregarVenta(newSale).subscribe({
      next: () => {
        this.folioCounter = (parseInt(this.folioCounter, 10) + 1).toString(); // Incrementa el folioCounter
        this.getCompras(); // Refresca la lista de compras
      },
      error: (error: any) => {
        console.error('Error al agregar la venta:', error);
      }
    });

    this.toggleAddSaleForm();
  }

  cancelAdd(): void {
    this.toggleAddSaleForm();
  }

  sortTable(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }

    this.compras.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  editSale(compra: any): void {
    const form = document.getElementById('editSaleForm');
    if (form) {
      this.editedProduct = compra.nombreProducto;
      this.editedQuantity = compra.cantidadProducto;
      this.editedTotalCost = compra.precioTotal;
      this.editedSaleDate = compra.fechaHoraEntrega.toISOString().substring(0, 10); // Solo la parte de la fecha
      this.editedSaleLocation = compra.direccion;
      form.style.display = 'block';
    }
  }
}