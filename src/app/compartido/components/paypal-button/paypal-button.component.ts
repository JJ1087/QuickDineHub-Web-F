/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, AfterViewInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-paypal-button',
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css']
})
export class PaypalButtonComponent implements AfterViewInit {
  @Input() createOrder?: (data: any, actions: any) => Promise<any>;
  @Input() onApprove?: (data: any, actions: any) => Promise<any>;
  @Input() fundingSource: string = 'paypal'; // Fuente de financiamiento (PayPal por defecto)

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    // Verifica si estamos en un entorno de navegador
    if (isPlatformBrowser(this.platformId)) {
      // Verifica si PayPal está disponible en el objeto window
      if ((window as any).paypal) {
        (window as any).paypal.Buttons({
          createOrder: this.createOrder,
          onApprove: this.onApprove,
          fundingSource: this.fundingSource
        }).render('#paypal-button-container'); // Renderiza el botón de PayPal
      } else {
        console.error('El SDK de PayPal no está disponible. Asegúrate de que se haya cargado correctamente.');
      }
    } else {
      console.warn('El componente PayPal no se puede renderizar fuera del navegador.');
    }
  }
}


