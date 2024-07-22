import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute para obtener parámetros de la URL
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MensajeComponent } from '../../../compartido/components/mensaje/mensaje.component';
import { MatDialog } from '@angular/material/dialog';
//COMENTARIO DE PRUEBA2
import { ViewChild, ElementRef } from '@angular/core';
import { Timestamp } from 'rxjs';



@Component({
  selector: 'app-carrito-cliente',
  templateUrl: './carrito-cliente.component.html',
  styleUrls: ['./carrito-cliente.component.css']
})
export class CarritoClienteComponent implements OnInit {

  @ViewChild('direccionSelect') direccionSelect!: ElementRef;
  @ViewChild('cuentaSelect') cuentaSelect!: ElementRef;

  idCliente: string ='';
  comensalId: string ='';

  mostrarFormularioDireccion = false;
  direcciones: any[] = [];
  nuevaDireccion = { colonia: '', calle: '', noCasa: '', datoExtra: '', idCliente: '' };

  mostrarFormularioCuenta = false;
  cuentas: any[] = [];
  nuevaCuenta = { nombreTitular: '', fechaVencimiento: '', noTarjeta: '', cvv: '', idCliente: '' };

  mostrarCompraExitosa = false;
  compraRealizada = false;

  cantidadSeleccionada = 1;
  precioTotal = 0;
  precioEnvio = 0;
  subTotal = 0;
  especificaciones = '';
  costoEnvio = 0;

  product: any;
  idRestaurante = '';
  idProducto = '';
  nombreProducto = '';
  descripcionProducto = '';
  costoUnidad = 0;
  idRepartidor = '000000000000000000000000';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage !== null) {
    this.idCliente = localStorage.getItem('ID_USER')||'';
    this.comensalId = localStorage.getItem('ID_USER')||'';

    if (this.idCliente) {
      const productId = this.route.snapshot.paramMap.get('id');
      if (productId) {
        this.loadProduct(productId);
      } else {
        console.error('El ID del producto es nulo.');
      }
      this.obtenerDirecciones();
      this.obtenerCuentas();
    } else {
      console.error("El entorno no admite 'localStorage'.");
    }
  }
  }
  private loadProduct(productId: string) {
    this.authService.obtenerInfoDeProductoPorId(productId).subscribe(
      (data) => {
        this.product = data;
        this.idRestaurante = data.idRestaurante;
        this.costoEnvio = data.costoEnvio;
        this.idProducto = productId;
        this.nombreProducto = data.nombre;
        this.descripcionProducto = data.descripcion;
        this.costoUnidad = Number(data.precio.$numberDecimal);
        this.actualizarTotal();
      },
      (error) => console.error('Error al obtener la información del producto:', error)
    );
  }

  // Métodos para manejar direcciones
  agregarDireccion() {
    this.nuevaDireccion.idCliente = this.idCliente!;
    this.authService.insertarDireccion(this.nuevaDireccion).subscribe(
      () => {
        this.obtenerDirecciones();
        this.nuevaDireccion = { colonia: '', calle: '', noCasa: '', datoExtra: '', idCliente: '' };
        this.mostrarFormularioDireccion = false;
        this.mostrarMensajeEmergente('Dirección creada', '');
      },
      (error) => {
        console.error('Error al insertar la dirección:', error);
        this.mostrarMensajeEmergente('Error al insertar la dirección', '');
      }
    );
  }

  obtenerDirecciones() {
    if (this.comensalId) {
      this.authService.obtenerDirecciones(this.comensalId).subscribe(
        (data) => this.direcciones = data,
        (error) => console.error('Error al obtener las direcciones:', error)
      );
    } else {
      console.log('No se está recibiendo el ID del comensal');
    }
  }

  // Métodos para manejar cuentas bancarias
  agregarCuenta() {
    this.nuevaCuenta.idCliente = this.idCliente!;
    this.authService.insertarCuenta(this.nuevaCuenta).subscribe(
      () => {
        this.obtenerCuentas();
        this.nuevaCuenta = { nombreTitular: '', fechaVencimiento: '', noTarjeta: '', cvv: '', idCliente: '' };
        this.mostrarFormularioCuenta = false;
        this.mostrarMensajeEmergente('Cuenta creada', '');
      },
      (error) => {
        console.error('Error al insertar la cuenta bancaria:', error);
        this.mostrarMensajeEmergente('Error al insertar la cuenta bancaria', '');
      }
    );
  }

  obtenerCuentas() {
    if (this.comensalId) {
      this.authService.obtenerCuentas(this.comensalId).subscribe(
        (data) => this.cuentas = data,
        (error) => console.error('Error al obtener las cuentas:', error)
      );
    } else {
      console.log('No se está recibiendo el ID del comensal');
    }
  }

  // Métodos para manejar la compra
  actualizarCantidad() {
    this.cantidadSeleccionada = Number(this.cantidadSeleccionada);
    this.validarCantidad();
    this.actualizarTotal();
  }

  validarCantidad() {
    if (this.cantidadSeleccionada < 0) {
      alert('Ingrese una cantidad correcta');
      this.cantidadSeleccionada = 1;
    } else if (this.cantidadSeleccionada > 100) {
      alert('La cantidad máxima permitida es 100');
      this.cantidadSeleccionada = 100;
    }
  }

  actualizarTotal() {
    this.precioTotal = Number(this.product.precio.$numberDecimal);
    this.precioEnvio = Number(this.product.costoEnvio.$numberDecimal);
    this.subTotal = this.precioTotal * this.cantidadSeleccionada + this.precioEnvio;
    this.precioTotal = Number(this.subTotal.toFixed(2));
  }

  crearOrden() {
    const nuevaOrden = {
      idCliente: this.idCliente,
      idRestaurante: this.idRestaurante,
      idRepartidor: this.idRepartidor,
      idDireccion: this.obtenerIdDireccion(),
      idCuentaBanco: this.obtenerIdCuentaBanco(),
      especificaciones: this.especificaciones,
      costoEnvio: this.costoEnvio,
      precioTotal: this.precioTotal
    };

    this.authService.crearOrden(nuevaOrden).subscribe(
      (response) => {
        const orderId = response._id;
        this.crearDetallesOrden(orderId);
      },
      (error) => {
        console.error('Error al crear la orden:', error);
        this.mostrarMensajeEmergente('Lo siento, no se pudo realizar la compra, intente de nuevo en unos minutos.', '');
      }
    );
  }

  crearDetallesOrden(orderId: string) {
    const nuevoDetalle = {
      idOrden: orderId,
      idProducto: this.idProducto,
      nombreProducto: this.nombreProducto,
      descripcionProducto: this.descripcionProducto,
      cantidadProducto: this.cantidadSeleccionada,
      costoUnidad: this.costoUnidad,
      subtotal: this.costoUnidad * this.cantidadSeleccionada,
    };

    this.authService.crearDetalleOrden(nuevoDetalle).subscribe(
      () => {
        this.resetearValores();
        this.mostrarCompraExitosa = true;
        this.compraRealizada = true;
      },
      (error) => {
        console.error('Error al crear el detalle de la orden:', error);
        this.mostrarMensajeEmergente('Lo siento, no se pudo realizar la compra, intente de nuevo en unos minutos.', '');
        this.eliminarOrdenCreada(orderId);
      }
    );
  }

  eliminarOrdenCreada(orderId: string) {
    this.authService.eliminarOrden(orderId).subscribe(
      () => console.log('Orden eliminada exitosamente.'),
      (error) => console.error('Error al eliminar la orden:', error)
    );
  }

  resetearValores() {
    this.especificaciones = '';
    this.costoEnvio = 0;
    this.precioTotal = 0;
  }

  obtenerIdDireccion(): string {
    return this.direccionSelect.nativeElement.value;
  }

  obtenerIdCuentaBanco(): string {
    return this.cuentaSelect.nativeElement.value;
  }

  realizarCompra() {
    this.crearOrden();
  }

  seguirComprando() {
    this.router.navigateByUrl('/inicio-cliente');
  }

  private mostrarMensajeEmergente(mensaje: string, redireccion: string) {
    this.dialog.open(MensajeComponent, {
      width: '400px',
      data: { mensaje: mensaje, redireccion: redireccion }
    });
  }
}