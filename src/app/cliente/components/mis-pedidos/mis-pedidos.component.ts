
 /* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// mis-pedidos.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
//import { reglas } from './regla';
import { reglas } from './reglas';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.css'
})

export class MisPedidosComponent implements OnInit {

  recomendaciones: string[] = [];

  mostrarModal = false;
  resena = '';
  calificacion = 0;
  estrellas: number[] = [1, 2, 3, 4, 5];
  idDetalleActual: string | null = null;

  mostrarModalRepartidor = false;
  resenaRepartidor = '';
  calificacionRepartidor = 0;

  detalleOrdenes: any[] = [];
  ordenes1: any[] = [];
  ordenesConEstadoUno: any[] = [];
  ordenesConEstadoDos: any[] = [];
  ordenesConEstadoSiete: any[] = [];
  ordenes: { [idOrden: string]: any[] } = {};
  comensalId: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage !== null) {
      this.comensalId = localStorage.getItem('ID_USER') || '';
      if (this.comensalId) {
        this.authService.obtenerOrdenes(this.comensalId).subscribe(
          (ordenes: any[]) => {
            this.ordenes1 = ordenes;
            console.log('Órdenes obtenidas:', this.ordenes1);
            // Filtrar detalles de órdenes basados en las órdenes del usuario.
            this.authService.obtenerdetalleOrdenes().subscribe(
              (detalleOrdenes: any[]) => {
                this.detalleOrdenes = detalleOrdenes.filter(detalle =>
                  this.ordenes1.some(orden => orden._id === detalle.idOrden)
                );
                this.organizarDetallesPorOrden();
                this.obtenerEstadosOrdenes();
                this.obtenerDetallesProducto();
              },
              (error) => {
                console.error('Error al obtener los detalles de las órdenes:', error);
              }
            );
          },
          (error) => {
            console.error('Error al obtener las órdenes:', error);
          }
        );
      } else {
        console.log('ID de usuario no encontrado en localStorage');
      }
    }
  }

  abrirFormularioResena(idDetalle: string) {
    this.idDetalleActual = idDetalle;
    this.mostrarModal = true;
  }

  cerrarFormularioResena() {
    this.mostrarModal = false;
    this.resena = '';
    this.calificacion = 0;
    this.idDetalleActual = null;
  }

  setCalificacion(valor: number) {
    this.calificacion = valor;
  }

  enviarResena() {
    if (this.idDetalleActual) {
      const nuevaResena = {
        idDetalle: this.idDetalleActual,
        calificacion: this.calificacion,
        resena: this.resena,
        fecha: new Date()
      };
      console.log('Reseña enviada:', nuevaResena);
      this.cerrarFormularioResena();
    }
  }

  agregarAnimacion(calificacion: number) {
    const estrellas = document.querySelectorAll('.fa-star');
    estrellas.forEach((estrella: Element, index: number) => {
      if (index < calificacion) {
        estrella.classList.add('animate');
        setTimeout(() => estrella.classList.remove('animate'), 500);
      }
    });
  }

  abrirFormularioResenaRepartidor(idDetalle: string) {
    this.idDetalleActual = idDetalle;
    this.mostrarModalRepartidor = true;
  }

  cerrarFormularioResenaRepartidor() {
    this.mostrarModalRepartidor = false;
    this.resenaRepartidor = '';
    this.calificacionRepartidor = 0;
    this.idDetalleActual = null;
  }

  setCalificacionRepartidor(valor: number) {
    this.calificacionRepartidor = valor;
  }

  enviarResenaRepartidor() {
    if (this.idDetalleActual) {
      const nuevaResenaRepartidor = {
        idDetalle: this.idDetalleActual,
        calificacion: this.calificacionRepartidor,
        resena: this.resenaRepartidor,
        fecha: new Date()
      };
      console.log('Reseña del repartidor enviada:', nuevaResenaRepartidor);
      this.cerrarFormularioResenaRepartidor();
    }
  }

  agregarAnimacionRepartidor(calificacion: number) {
    const estrellas = document.querySelectorAll('.fa-star');
    estrellas.forEach((estrella: Element, index: number) => {
      if (index < calificacion) {
        estrella.classList.add('animate');
        setTimeout(() => estrella.classList.remove('animate'), 500);
      }
    });
  }

  organizarDetallesPorOrden() {
    this.ordenes = {};
    this.detalleOrdenes.forEach(detalle => {
      if (!this.ordenes[detalle.idOrden]) {
        this.ordenes[detalle.idOrden] = [];
      }
      this.ordenes[detalle.idOrden].push(detalle);
    });

    Object.keys(this.ordenes).forEach(key => {
      this.ordenes[key] = this.ordenes[key].reverse();
    });

    console.log('Detalles de órdenes organizados por orden:', this.ordenes);
  }

  obtenerEstadosOrdenes() {
    const idsOrdenes = Object.keys(this.ordenes);
    idsOrdenes.forEach(ordenId => {
      this.authService.obtenerInfoDeOrdenPorId(ordenId).subscribe((orden: any) => {
        this.ordenes[ordenId].forEach(detalle => {
          detalle.estadoOrden = orden.estadoOrden;
          detalle.fechaPedido = orden.createdAt;
          detalle.idRestaurante = orden.idRestaurante;
          this.obtenerInformacionRestaurante(detalle);
        });
      }, (error) => {
        console.error('Error al obtener la orden con ID', ordenId, ':', error);
      });
    });
  }

  obtenerInformacionRestaurante(detalle: any) {
    const idRestaurante = detalle.idRestaurante;
    console.log('Restaurante ID:', idRestaurante);
    this.authService.obtenerRestaurante(idRestaurante).subscribe(
      (restaurante: any) => {
        detalle.nombreRestaurante = restaurante.nombreRestaurante;
      },
      (error) => {
        console.error('Error al obtener la información del restaurante:', error);
      }
    );
  }

  obtenerEstado(estadoOrden: number): string {
    switch (estadoOrden) {
      case 0:
        return 'Pedido en espera de ser aceptado por el restaurante';
      case 1:
        return 'Orden rechazada';
      case 2:
        return '¿Desea continuar con la compra?';
      case 3:
        return 'Pedido en espera de ser aceptado por el restaurante';
      case 4:
        return 'En preparación';
      case 5:
        return 'Esperando repartidor';
      case 6:
        return 'Salió de cocina, en camino';
      case 7:
        return 'Confirmar entrega';
      case 8:
        return 'Pedido cancelado';
      case 9:
        return 'Entregado';
      default:
        return 'Cargando estado';
    }
  }

  /*obtenerDetallesProducto() {
    let idsProductos: string[] = [];

    this.detalleOrdenes.forEach(detalle => {
      idsProductos.push(detalle.idProducto);
    });

    idsProductos.forEach((productId, index) => {
      this.authService.obtenerInfoDeProductoPorId(productId).subscribe((producto: any) => {
        console.log('Producto:', producto);
        this.detalleOrdenes[index].producto = producto;
        console.log('Detalles de órdenes actualizados:', this.detalleOrdenes);
      }, (error) => {
        console.error('Error al obtener el producto con ID', productId, ':', error);
      });
    });
  }*/
//------------------------------------------------------------CODIGO FUNCIONAL
  /*obtenerDetallesProducto() {
    let idsProductos: string[] = [];

    this.detalleOrdenes.forEach(detalle => {
      idsProductos.push(detalle.idProducto);
    });

    idsProductos.forEach((productId, index) => {
      this.authService.obtenerInfoDeProductoPorId(productId).subscribe((producto: any) => {
        console.log('Producto:', producto);
        this.detalleOrdenes[index].producto = producto;
        console.log('Detalles de órdenes actualizados:', this.detalleOrdenes);

        //if (index === idsProductos.length - 1) {
          // Extraer los últimos 5 productos
          let nombresProductos = this.detalleOrdenes.slice(-5).map(detalle => detalle.nombreProducto);
          console.log('Recomendaciones:', nombresProductos);
          this.recomendaciones = this.recomendarProductos(nombresProductos);
          console.log('Recomendaciones:', this.recomendaciones);
          // Aquí puedes manejar las recomendaciones, por ejemplo, mostrarlas en la interfaz
        //}
      }, (error) => {
        console.error('Error al obtener el producto con ID', productId, ':', error);
      });
    });
  }

  recomendarProductos(productosSolicitados: string[]): string[] {
    let recomendaciones = new Set<string>();

    reglas.forEach(regla => {
      if (regla.antecedents.every(antecedente => productosSolicitados.includes(antecedente))) {
        regla.consequents.forEach(consecuente => {
          if (!productosSolicitados.includes(consecuente)) {
            recomendaciones.add(consecuente);
          }
        });
      }
    });

    return Array.from(recomendaciones);
  }*/

  obtenerDetallesProducto() {
    const idsProductos: string[] = [];

    this.detalleOrdenes.forEach(detalle => {
      idsProductos.push(detalle.idProducto);
    });

    const totalProductos = idsProductos.length;
    let productosObtenidos = 0;

    idsProductos.forEach((productId, index) => {
      this.authService.obtenerInfoDeProductoPorId(productId).subscribe((producto: any) => {
        console.log('Producto:', producto);
        this.detalleOrdenes[index].producto = producto;
        productosObtenidos++;

          const nombresProductos = this.detalleOrdenes
            .slice(-7)
            .map(detalle => detalle.nombreProducto);
          console.log('Productos solicitados:', nombresProductos);
          this.recomendaciones = this.recomendarProductos(nombresProductos);
          console.log('Recomendaciones:', this.recomendaciones);
          // Aquí puedes manejar las recomendaciones, por ejemplo, mostrarlas en la interfaz
        //}

        console.log('Detalles de órdenes actualizados:', this.detalleOrdenes);
      }, (error) => {
        console.error('Error al obtener el producto con ID', productId, ':', error);
      });
    });
  }

  recomendarProductos(productosSolicitados: string[]): string[] {
    const recomendaciones = new Set<string>();

    reglas.forEach(regla => {
      if (regla.antecedents.every(antecedente => productosSolicitados.includes(antecedente))) {
        regla.consequents.forEach(consecuente => {
          if (!productosSolicitados.includes(consecuente)) {
            recomendaciones.add(consecuente);
          }
        });
      }
    });

    return Array.from(recomendaciones);
  }



  getImageUrl(relativePath: string): string {
    const baseUrl = 'https://quickdinehub-back1.onrender.com';//const baseUrl = 'http://localhost:3000';
    return baseUrl + '/' + relativePath;
  }

  verDetalles(detalleId: string) {
    this.router.navigate(['../estado-envio', detalleId]);
  }

  actualizarOrdenes(): void {
    console.log('Ejecutando actualización de órdenes');
    this.authService.obtenerOrdenes(this.comensalId).subscribe(
      (ordenes: any[]) => {
        this.ordenes1 = ordenes;
        console.log('Órdenes actualizadas:', this.ordenes1);
        this.detalleOrdenes = this.detalleOrdenes.filter(detalle =>
          this.ordenes1.some(orden => orden.idOrden === detalle.idOrden)
        );
        this.organizarDetallesPorOrden();
        this.obtenerEstadosOrdenes();
        this.obtenerDetallesProducto();
        console.log('Actualización completada');
      },
      (error) => {
        console.error('Error al actualizar las órdenes:', error);
      }
    );
  }
}
