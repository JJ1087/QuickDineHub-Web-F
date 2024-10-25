/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cli-ofertas',
  templateUrl: './cli-ofertas.component.html',
  styleUrl: './cli-ofertas.component.css'
})
export class CliOfertasComponent implements OnInit {

  ofertas: any[] = [];

  constructor(private AuthService: AuthService) { }

  ngOnInit(): void {
    
    if (typeof window !== 'undefined' && localStorage !== null) {
     
      this.cargarOfertas();
  
    } else {
      console.error("El entorno no admite 'localStorage'.");


    }

  }
  cargarOfertas(): void {
    this.AuthService.obtenerInfoOferta().subscribe(
      (data) => {
        this.ofertas = data;
      },
      (error) => {
        console.error('Error al obtener ofertas:', error);
      }
    );
  }
 // Método para generar la URL completa de la imagen
 getImageUrl(relativePath: string): string {
  return `https://quickdinehub-back1.onrender.com/${relativePath}`;//
  //return http://localhost:3000/${relativePath};
}

}