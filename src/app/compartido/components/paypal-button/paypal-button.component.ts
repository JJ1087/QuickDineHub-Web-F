/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-paypal-button',
  templateUrl: './paypal-button.component.html',
  //styleUrl: './paypal-button.component.css'
  styleUrls: ['./paypal-button.component.css'] 
})
export class PaypalButtonComponent implements AfterViewInit {
  @Input() createOrder?: (data: any, actions: any) => Promise<any>;
  @Input() onApprove?: (data: any, actions: any) => Promise<any>;
  @Input() fundingSource: string = 'paypal'; // Nueva entrada para fundingSource

  ngAfterViewInit() {
    if ((window as any).paypal) {
      (window as any).paypal.Buttons({
        createOrder: this.createOrder,
        onApprove: this.onApprove,
        fundingSource: this.fundingSource
      }).render('#paypal-button-container'); // Aquí renderizamos el botón
    }
  }

}


