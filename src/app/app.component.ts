/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component,OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PreguntaSecretaService } from '../app/compartido/services/preguntaSecreta.service';
import { inject } from '@vercel/analytics';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'proyecto';
  
  public readonly VAPID_PUBLIC_KEY = 'BOpKJl1P-s-gcH5dhTqjzF6-KbB-D8lenn3kYMhhpvGEq1TLSFUpaOa6698F5ZLg0yGVbLqSBdhvuO7I94m8cMc';
  //{"publicKey":"BOpKJl1P-s-gcH5dhTqjzF6-KbB-D8lenn3kYMhhpvGEq1TLSFUpaOa6698F5ZLg0yGVbLqSBdhvuO7I94m8cMc","privateKey":"9HeLyr98wdMf1-sXyF5aducGyykqDP-D69nzIp1BgOA"}
  constructor( ) {
    inject();
  }

    ngOnInit(): void {
      
    }


}
