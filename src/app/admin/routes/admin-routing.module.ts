// src/app/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPerfilesComponent } from '../components/admin-perfiles/admin-perfiles.component';
import { AdminActivacionPerfilesComponent } from '../components/admin-activacion-perfiles/admin-activacion-perfiles.component';
import { InfoRegistroRestauranteComponent } from '../components/info-registro-restaurante/info-registro-restaurante.component';
import { InfoRegistroRepartidorComponent } from '../components/info-registro-repartidor/info-registro-repartidor.component';
import { InfoRegistroClienteComponent } from '../components/info-registro-cliente/info-registro-cliente.component';
import { AdmnPagosComponent } from '../components/admn-pagos/admn-pagos.component';
import { InicioAdminComponent } from '../components/inicio-admin/inicio-admin.component';
import { LoginAdminComponent } from '../components/login-admin/login-admin.component';


const routes: Routes = [
  { path: 'admin-perfiles', component: AdminPerfilesComponent },
  { path: 'admin-activacion-perfiles', component: AdminActivacionPerfilesComponent },
  { path: 'info-registro-restaurante', component: InfoRegistroRestauranteComponent },
  { path: 'info-registro-repartidor', component: InfoRegistroRepartidorComponent},
  { path: 'info-registro-cliente', component: InfoRegistroClienteComponent},
  { path: 'admn-pagos', component: AdmnPagosComponent},
  { path: 'inicio-admin', component: InicioAdminComponent},
  { path: 'login-admin', component: LoginAdminComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
