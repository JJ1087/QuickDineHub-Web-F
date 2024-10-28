import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cli-ofertas',
  templateUrl: './cli-ofertas.component.html',
  styleUrl: './cli-ofertas.component.css'
})
export class CliOfertasComponent implements OnInit {
  isOnline: boolean = navigator.onLine;
  offlineImageIcon: string = 'assets/sinconexion.png'; // Ruta al ícono de "Sin conexión"

  ofertas: any[] = [];

  constructor(private AuthService: AuthService) { }

  ngOnInit(): void {
    
    if (typeof window !== 'undefined' && localStorage !== null) {
      window.addEventListener('online', this.updateOnlineStatus.bind(this));
      window.addEventListener('offline', this.updateOnlineStatus.bind(this));
     
      this.cargarOfertas();
  
    } else {
      console.error("El entorno no admite 'localStorage'.");


    }

  }

  updateOnlineStatus(): void {
    this.isOnline = navigator.onLine;
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
  return this.isOnline ? `https://quickdinehub-back1.onrender.com/${relativePath}` : this.offlineImageIcon;//
  //return http://localhost:3000/${relativePath};
}

}