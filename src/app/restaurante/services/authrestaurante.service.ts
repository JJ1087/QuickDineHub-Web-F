/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthrestauranteService {
AUTH_SERVER: string = 'https://quickdinehub-back1.onrender.com';//
//AUTH_SERVER: string = 'http://localhost:3000';
  private token: string | null = null;

  constructor(private httpClient: HttpClient) { }

  

  //USUARIO RSTAURANTE
  RegistroRestaurante(usuarioRestaurante: FormData): Observable<unknown> {
    return this.httpClient.post<unknown>(`${this.AUTH_SERVER}/registro-restaurante`, usuarioRestaurante);
  }

  loginRestaurante(userRestaurante: unknown): Observable<unknown> {
  //loginRestaurante(userRestaurante: UserRestaurante): Observable<LoginResponse> {
    return this.httpClient.post<unknown>(`${this.AUTH_SERVER}/login-restaurante`, userRestaurante).pipe(tap(
      (res: any) => {
        if (res && res.dataRestaurant) {
          localStorage.setItem("RESTAURANT_ID", res.dataRestaurant.id);
          localStorage.setItem("RESTAURANT_NAME", res.dataRestaurant.nombreRestaurante);
          localStorage.setItem("ACCESS_TOKEN", res.dataRestaurant.accessToken);
          localStorage.setItem("EXPIRES_IN", res.dataRestaurant.expiresIn);//eyt
        }
      })
    );
  }

  logout() {
    this.token = '';
    localStorage.removeItem("RESTAURANT_ID");
    localStorage.removeItem("RESTAURANT_NAME");
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
  }
//PRODUCTOS DE RESTAURANTE
  CrearProducto(Producto: FormData): Observable<unknown> {
    return this.httpClient.post(`${this.AUTH_SERVER}/crear-producto`, Producto);
  }

  ActualizarProducto(idProducto: string, Producto: FormData): Observable<unknown> {
    return this.httpClient.put(`${this.AUTH_SERVER}/actualizar-producto/${idProducto}`, Producto);
  }

  eliminarProducto(idProducto: string): Observable<unknown> {
    return this.httpClient.delete<unknown>(`${this.AUTH_SERVER}/eliminar-producto/${idProducto}`);
  }

  getProductos(restauranteId: unknown): Observable<unknown[]> {
    return this.httpClient.get<unknown[]>(`${this.AUTH_SERVER}/mostrar-producto/${restauranteId}`);
  }

//PEDIDOS
mostrarPedidos(restauranteId: unknown): Observable<unknown[]> {
  return this.httpClient.get<unknown[]>(`${this.AUTH_SERVER}/mostrar-pedido/${restauranteId}`);
}

aceptarOrden(pedidoId: string): Observable<unknown> {
  return this.httpClient.put(`${this.AUTH_SERVER}/aceptar-pedido/${pedidoId}`, null);
}

rechazarOrden(pedidoId: string): Observable<unknown> {
return this.httpClient.put(`${this.AUTH_SERVER}/rechazar-pedido/${pedidoId}`, null);
}


OrdenCompletada(pedidoId: string): Observable<unknown> {
return this.httpClient.put(`${this.AUTH_SERVER}/terminada-pedido/${pedidoId}`, null);
}

OrdenEnvio(pedidoId: string): Observable<unknown> {
return this.httpClient.put(`${this.AUTH_SERVER}/envio-pedido/${pedidoId}`, null);
}

cancelarProducto(pedidoId: string, productoCancelado: unknown): Observable<unknown> {
return this.httpClient.put(`${this.AUTH_SERVER}/cancelar-producto/${pedidoId}`, productoCancelado);
}

//Correo de cambio
correoCancelarProducto(email: string, nombreProducto: string, nombreCliente: string): Observable<unknown> {
  return this.httpClient.post<unknown>(`${this.AUTH_SERVER}/enviar-correo-cancelarproducto`, { email, nombreProducto, nombreCliente});
}

correoCancelarOrden(email: string,  nombreCliente: string): Observable<unknown> {
  return this.httpClient.post<unknown>(`${this.AUTH_SERVER}/enviar-correo-cancelarOrden`, { email, nombreCliente});
}

//agregar nueva compra completada en el sitio web:
agregarCompraRealizadaSitio(pedidoId: unknown): Observable<unknown> {
  return this.httpClient.post<unknown>(`${this.AUTH_SERVER}/comprasRealizadasSitio`, pedidoId);
}

getProductos2(restauranteId: unknown): Observable<unknown[]> {
  return this.httpClient.get<unknown[]>(`${this.AUTH_SERVER}/mostrar-producto/${restauranteId}`);
}

obtenerComprasPorRestaurante(idRestaurante: unknown): Observable<unknown[]> {
  return this.httpClient.get<unknown[]>(`${this.AUTH_SERVER}/compras-realizada/${idRestaurante}`);
}

agregarVenta(newSale: unknown): Observable<unknown> {
  return this.httpClient.post(`${this.AUTH_SERVER}/compras`, newSale);
}
//Oferta
CrearOferta(Oferta: FormData): Observable<unknown> {
  return this.httpClient.post(`${this.AUTH_SERVER}/crear-oferta`, Oferta);
}

eliminarOferta(idOferta: string): Observable<unknown> {
  return this.httpClient.delete<unknown>(`${this.AUTH_SERVER}/eliminar-oferta/${idOferta}`);
}
getOfertas(restauranteId: unknown): Observable<unknown[]> {
  return this.httpClient.get<unknown[]>(`${this.AUTH_SERVER}/mostrar-oferta/${restauranteId}`);
}

}

