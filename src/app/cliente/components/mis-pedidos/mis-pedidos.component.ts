// mis-pedidos.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.css'
})

export class MisPedidosComponent implements OnInit {


  

  constructor(private router: Router, private authService: AuthService) { }

  detalleOrdenes: any[] = [];
  ngOnInit(): void {
   
    this.authService.obtenerdetalleOrdenes().subscribe((detalleOrdenes: any[]) => {
      console.log('Detalle de órdenes:', detalleOrdenes);
      this.detalleOrdenes = detalleOrdenes;

      this.obtenerOrdenes(); 
      this.organizarDetallesPorOrden(); // Llamada para organizar los detalles por "orden"
      this.obtenerEstadosOrdenes(); // Llamada para obtener el estado de cada orden
      this.obtenerDetallesProducto();


    }, (error) => {
      console.error('Error al obtener los detalles de las órdenes:', error);
    }); 
    
  }

//esta funcion para traer ordenes ayuda a la parte de las notificaciones--------------------------------
//Funcion para llamar a mis ordenes--------------------------------------------------------------------------

    ordenes1: any[] = [];
    ordenesConEstadoUno: any[] = [];
    ordenesConEstadoDos: any[] = [];
    ordenesConEstadoSiete: any[] = [];
    
   comensalId: string = '661e7ad5a82e3dbd2d0c3067';//TOMAR EL ID DEL CLIENTE EN LOCALSTORAGE en el futuro 
    obtenerOrdenes() {
    

    if (this.comensalId) {
     // Llama a la función del servicio para obtener las direcciones desde el backend
     this.authService.obtenerOrdenes(this.comensalId).subscribe(
       (data) => {
         // Actualiza la lista de ordenes con los datos obtenidos
         this.ordenes1 = data;
         console.log('Ordenes recibidas', this.ordenes1);
         
        // Filtra las órdenes para encontrar aquellas con estadoOrden igual a 2
        this.ordenesConEstadoDos = this.ordenes1.filter((orden: any) => orden.estadoOrden === 2);
        console.log('Ordenes con estadoOrden igual a 2:', this.ordenesConEstadoDos);

        // Filtra las órdenes para encontrar aquellas con estadoOrden igual a 1
        this.ordenesConEstadoUno = this.ordenes1.filter((orden: any) => orden.estadoOrden === 1);
        console.log('Ordenes con estadoOrden igual a 1:', this.ordenesConEstadoDos);

        // Filtra las órdenes para encontrar aquellas con estadoOrden igual a 7 esperando a finalizar la entrega
        this.ordenesConEstadoSiete = this.ordenes1.filter((orden: any) => orden.estadoOrden === 7);
        console.log('Ordenes con estadoOrden igual a 7:', this.ordenesConEstadoSiete);

       },
       (error) => {
         console.error('Error al obtener las ordenes:', error);
         
         // Maneja el error según sea necesario
       }
     );

    }else{
      console.log('No se esta recibiendo el id de la orden');
    }
   }


//ORganizar y agrupar los productos de las ordenes---------------------------------------------------------------

  ordenes: { [idOrden: string]: any[] } = {}; 
 
  organizarDetallesPorOrden() {
    this.ordenes = {}; // Limpiar el objeto de órdenes
    this.detalleOrdenes.forEach(detalle => {
      if (!this.ordenes[detalle.idOrden]) {
        this.ordenes[detalle.idOrden] = []; // Inicializar el arreglo de detalles para esta orden
      }
      this.ordenes[detalle.idOrden].push(detalle); // Agregar el detalle a la orden correspondiente
    });

    // Invertir el orden de los detalles de cada orden
  Object.keys(this.ordenes).forEach(key => {
    this.ordenes[key] = this.ordenes[key].reverse();
  });
  
    console.log('Detalles de órdenes organizados por orden:', this.ordenes);
  }

  //este funciona para la lista y las agrupaciones
  obtenerEstadosOrdenes() {
    const idsOrdenes = Object.keys(this.ordenes);
    idsOrdenes.forEach(ordenId => {
      this.authService.obtenerInfoDeOrdenPorId(ordenId).subscribe((orden: any) => {
        //console.log('Orden:', orden); 
        // Agregar el estado de la orden a cada detalleOrden correspondiente
        this.ordenes[ordenId].forEach(detalle => {
          detalle.estadoOrden = orden.estadoOrden;
          detalle.fechaPedido = orden.createdAt;
          detalle.idRestaurante = orden.idRestaurante; // Guardar el valor de isRestaurante
          //console.log('parangacutirimicuaro1: ',detalle);
          this.obtenerInformacionRestaurante(detalle); // Obtener información del restaurante
        });
      }, (error) => {
        console.error('Error al obtener la orden con ID', ordenId, ':', error);
      });
    });
  }

  obtenerInformacionRestaurante(detalle: any) {  
    // Obtener el id del restaurante desde el detalle
    const idRestaurante = detalle.idRestaurante; 
    console.log('parangacutirimicuaro: ',detalle.idRestaurante);
    // Utilizar el servicio para obtener la información del restaurante por su id
    this.authService.obtenerRestaurante(idRestaurante).subscribe(
      (restaurante: any) => {
        // Agregar el nombre del restaurante al detalle de orden
        detalle.nombreRestaurante = restaurante.nombreRestaurante;
      },
      (error) => {
        console.error('Error al obtener la información del restaurante:', error); 
      }
    );
  }
  

  // Método para obtener el estado legible de la orden
  obtenerEstado(estadoOrden: number): string {
    switch (estadoOrden) {
      case 0:
        return 'Pedido en espera de ser aceptado por el restaurante';
      case 1:
        return 'Orden rechazada';//Mensaje de enterado, cuando de aceptar eliminar los detalles de la orden cancelada
      case 2:
        return '¿Desea continuar con la compra?';//Mensaje de que alimento se quito,si rechaza eliminar orden completa, si no solo eliminar un detalle de orden
      case 3:
        return 'Pedido en espera de ser aceptado por el restaurante';
      case 4:
        return 'En preparación';
      case 5:
        return 'Esperando repartidor';
      case 6:
        return 'Salio de cocina, en camino';
      case 7:
        return 'Confirmar entrega';//Alarma para finalizar pedido
      case 8:
        return 'Pedido cancelado';
      case 9:
        return 'Entregado';
      default:
        return 'Cargando estado';
    }
  }

  obtenerDetallesProducto() {
    // Array para almacenar los IDs de los productos
    let idsProductos: string[] = [];
  
    // Obtener los IDs de los productos de los detalles de las órdenes
    this.detalleOrdenes.forEach(detalle => {
      idsProductos.push(detalle.idProducto);
    });
  
    // Utilizar los IDs de los productos para hacer solicitudes para obtener los datos de los productos
    idsProductos.forEach((productId, index) => {
      this.authService.obtenerInfoDeProductoPorId(productId).subscribe((producto: any) => {
        console.log('Producto:', producto);
        // Asignar la información del producto al detalle correspondiente en detalleOrdenes
        this.detalleOrdenes[index].producto = producto;
        console.log('ya merito nos vamos: ', this.detalleOrdenes);
      }, (error) => {
        console.error('Error al obtener el producto con ID', productId, ':', error);
      });
    });
  }

  // Método para generar la URL completa de la imagen
getImageUrl(relativePath: string): string {
  // Aquí debes agregar la URL base de tu servidor
  const baseUrl = 'http://localhost:3000';
  return baseUrl + '/' + relativePath;
}

  

  // Función para ver detalles de compra
  verDetalles(detalleId: string) {

    this.router.navigate(['../estado-envio', detalleId]);
  }
  
  actualizarOrdenes(): void {
    console.log('Ejecutando actualizacion de ordenes');
    this.obtenerOrdenes();
    this.ngOnInit();  
    console.log('Si se pudo tilin');
}


}
