import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-header-cliente',
  templateUrl: './header-cliente.component.html',
  styleUrl: './header-cliente.component.css'
})
export class HeaderClienteComponent {
  constructor(private authrestauranteService: AuthService, private router: Router) { }
  logout(): void {
    this.authrestauranteService.logout(); // Llama a la función logout() del servicio AuthService
    this.router.navigate(['./']); // Redirige a la página de inicio
  }

}
