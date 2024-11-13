 /* eslint-disable @typescript-eslint/no-unused-vars */
 /* eslint-disable @typescript-eslint/no-explicit-any */
 /*home.component.ts */
 import { Component, OnInit, HostListener } from '@angular/core';
 import { SwPush } from '@angular/service-worker';
 
import { PreguntaSecretaService } from '../../app/compartido/services/preguntaSecreta.service';
 
 /* eslint-disable no-var */
 declare var SpeechSynthesis: any;
 /* eslint-enable no-var */

 @Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   styleUrl: './home.component.css'
 })
 
 export class HomeComponent implements OnInit {
   private synth!: SpeechSynthesis;
   private utterance: SpeechSynthesisUtterance | null = null!;
   scrolledDown = false;
   
  readonly VAPID_PUBLIC_KEY = 'BOpKJl1P-s-gcH5dhTqjzF6-KbB-D8lenn3kYMhhpvGEq1TLSFUpaOa6698F5ZLg0yGVbLqSBdhvuO7I94m8cMc';
   //{"publicKey":"BOpKJl1P-s-gcH5dhTqjzF6-KbB-D8lenn3kYMhhpvGEq1TLSFUpaOa6698F5ZLg0yGVbLqSBdhvuO7I94m8cMc","privateKey":"9HeLyr98wdMf1-sXyF5aducGyykqDP-D69nzIp1BgOA"}
   
   constructor( private swPush: SwPush, private preguntaToken: PreguntaSecretaService ) {
   
   // this.subscribeToNotifications();
  
  }
 // CODIGO NOTIFICACIONES 

  //  subscribeToNotifications(): any{
 
  //    this.swPush.requestSubscription(
  //     {
  //      serverPublicKey: this.VAPID_PUBLIC_KEY
  //    }).then(sub =>{

  //     const token = JSON.parse(JSON.stringify(sub));

  //     this.preguntaToken.sendSubscription(token).subscribe((res)=>
  //     {
  //      console.log(res);
  //     }, (err) => {
  //       console.log('ERROR', err);
  //     }  );
 
  //    })
  //    .catch(err =>console.error(' :(',err))
  //  }
   
//FIN CODIGO NOTIFICACIONES

   ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // Coloca aquí el código que utiliza window
    }
    navigator.serviceWorker.register('/ngsw-worker.js').then(registration => {
      console.log('Service worker registrado con éxito:', registration);
  }).catch(error => {
      console.error('Error al registrar el service worker:', error);
  });
  }
  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Verifica si el usuario ha hecho scroll hacia abajo
    this.scrolledDown = window.scrollY > 0;

    // Lógica para manejar la aparición de los elementos
    this.checkScroll();
  }

  checkScroll() {
    const componentes = document.querySelectorAll('.restaurantes-section, .clientes-section, .chatbot-section');

    componentes.forEach(comp => {
      const position = comp.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;

      if (position < screenHeight * 0.75) {
        comp.classList.add('visible');
      } else {
        comp.classList.remove('visible');
      }
    });
  }
   // Función para habilitar/deshabilitar la lectura en voz alta al pasar el ratón
   toggleVozAlta() {
    const enableVozAlta = document.getElementById('enableVozAlta') as HTMLInputElement;
    this.synth = window.speechSynthesis;
  
    const elementos = document.querySelectorAll('a, img, h1, p, h2, .title, span, .option');
  
    elementos.forEach(elemento => {
      elemento.addEventListener('mouseover', () => {
        if (enableVozAlta.checked) {
          if (this.synth.speaking && this.utterance) {
            this.synth.cancel();
          }
  
          let texto = '';
  
          // Verificar si el elemento es una imagen antes de acceder a 'alt'
          if (elemento instanceof HTMLImageElement) {
            texto = elemento.alt;
          } else if (elemento instanceof HTMLElement) {
            texto = elemento.innerText || elemento.textContent || '';
          }
  
          if (texto.trim() !== '') {
            this.utterance = new SpeechSynthesisUtterance(texto);
            this.synth.speak(this.utterance);
          }
        }
      });
    });
  }  
   
 }