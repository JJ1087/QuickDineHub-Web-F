import { Component } from '@angular/core';

@Component({
  selector: 'app-rep-pagos',
  templateUrl: './rep-pagos.component.html',
  styleUrl: './rep-pagos.component.css'
})
export class RepPagosComponent {
  showAddSaleForm: boolean = false;
  showAddSaleForm1: boolean = false;
  filteredRows: any[] = [
    { amount: '$200', account: '**** **** **** ****', date: '22/11/2023' },
    { amount: '$150', account: '**** **** **** ****', date: '22/11/2023' },
    { amount: '$200', account: '**** **** **** ****', date: '21/11/2023' },
    { amount: '$100', account: '**** **** **** ****', date: '21/11/2023' },
    { amount: '$100', account: '**** **** **** ****', date: '20/11/2023' }
  ];
  allRows: any[] = [...this.filteredRows];

  toggleAddSaleForm() {
    this.showAddSaleForm = !this.showAddSaleForm;
    if (this.showAddSaleForm) {
      this.resetForm();
    }
  }

  toggleAddSaleForm1() {
    this.showAddSaleForm1 = !this.showAddSaleForm1;
    if (this.showAddSaleForm1) {
      this.resetForm();
    }
  }

  cancelAdd() {
    this.showAddSaleForm = false;
  }

  cancelAdd1() {
    this.showAddSaleForm1 = false;
  }

  addSale(event: Event) {
    event.preventDefault();
    // Lógica para agregar la cuenta bancaria
    console.log('Agregando cuenta bancaria...');
    this.cancelAdd(); // Cierra el formulario
  }

  addSale1(event: Event) {
    event.preventDefault();
    // Lógica para retirar dinero
    console.log('Retirando dinero...');
    this.cancelAdd1(); // Cierra el formulario
  }
  resetForm() {
    // Lógica para resetear el formulario
    console.log('Formulario reseteado');
  }

  filterTable(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    const searchColumn = (document.getElementById('searchColumn') as HTMLSelectElement).value;

    this.filteredRows = this.allRows.filter(row => {
      const cellValue = row[Object.keys(row)[parseInt(searchColumn)]].toLowerCase();
      return cellValue.includes(searchTerm);
    });
  }
}
