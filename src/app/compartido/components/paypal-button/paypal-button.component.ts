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
  @Input() fundingSource: string = 'paypal'; // Nueva entrada para fundingSource

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if ((window as any).paypal) {
        (window as any).paypal.Buttons({
          createOrder: this.createOrder,
          onApprove: this.onApprove,
          fundingSource: this.fundingSource
        }).render('#paypal-button-container'); // Aquí renderizamos el botón
      } else {
        console.error('PayPal SDK no está disponible.');
      }
    } else {
      console.warn('Intento de ejecutar código en un entorno no navegador.');
    }
  }
}