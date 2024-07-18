// src/app/repartidor/repartidor-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRepartidoresComponent } from '../components/login-repartidores/login-repartidores.component';
import { RegistroRepartidorComponent } from '../components/registro-repartidor/registro-repartidor.component';
import { InicioRepartidorComponent } from '../components/inicio-repartidor/inicio-repartidor.component';
import { RepartidorGuard } from '../services/guards/auth.Repartidor.guard';
import { ResenasRepartidorComponent } from '../components/resenas-repartidor/resenas-repartidor.component';
import { HistorialRepartidorComponent } from '../components/historial-repartidor/historial-repartidor.component';
import { RepPagosComponent } from '../components/rep-pagos/rep-pagos.component';

const routes: Routes = [
  { path: 'login-repartidores', component: LoginRepartidoresComponent },
  { path: 'registro-repartidor', component: RegistroRepartidorComponent },
  { path: 'inicio-repartidor', component: InicioRepartidorComponent, canActivate:[RepartidorGuard] },
  { path: 'resenas-repartidor', component: ResenasRepartidorComponent },
  { path: 'historial-repartidor', component: HistorialRepartidorComponent },
  { path: 'rep-pagos', component: RepPagosComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepartidorRoutingModule { }
