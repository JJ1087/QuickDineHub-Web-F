import { Component, OnInit } from '@angular/core';
import { AuthrestauranteService } from '../../services/authrestaurante.service';
import { MensajeComponent } from '../../../compartido/components/mensaje/mensaje.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-ofertas-restaurante',
  templateUrl: './ofertas-restaurante.component.html',
  styleUrl: './ofertas-restaurante.component.css'
})
export class OfertasRestauranteComponent implements OnInit {
  private synth!: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null!;
  idoferta: string = '';

  nombreRestaurante: string | null = null;
  restauranteId: string | null = null;
  imagen: File[] = [];
  titulo: string = '';
  descripcion: string = '';
  precioOriginal: string = '';
  precioOferta: string = '';
  TipoOferta: string = '';

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage !== null) {
      const restaurantId = localStorage.getItem('RESTAURANT_ID');
      if (restaurantId) {
        this.restauranteId = restaurantId;
        this.nombreRestaurante = localStorage.getItem('RESTAURANT_NAME');
        console.log("Nombre del restaurante encontrado:", this.nombreRestaurante);
      } else {
        console.error("No se encontró 'RESTAURANT_ID' en localStorage.");
      }
      this.obtenerProductos();
    } else {
      console.error("LocalStorage o window no están disponibles.");
    }
  }

  toggleVozAlta() {
    const enableVozAlta = document.getElementById('enableVozAlta') as HTMLInputElement;
    this.synth = window.speechSynthesis;

    const elementos = document.querySelectorAll('a, img, h1,li, p, h2, .title, .option, label, button');

    elementos.forEach(elemento => {
      elemento.addEventListener('mouseover', () => {
        if (enableVozAlta.checked) {
          if (this.synth.speaking && this.utterance) {
            this.synth.cancel();
          }

          let texto = '';

          if (elemento instanceof HTMLImageElement) {
            texto = elemento.alt;
          } else if (elemento instanceof HTMLElement) {
            texto = elemento.innerText || elemento.textContent || '';
          }

          if (texto.trim() !== '') {
            this.utterance = new SpeechSynthesisUtterance(texto);
            console.log("Texto leído en voz alta:", texto);
            this.synth.speak(this.utterance);
          }
        }
      });
    });
  }

  ofertas: any[] = [];

  nuevaOferta = {
    titulo: '',
    descripcion: '',
    precioOriginal: '',
    precioOferta: '',
    TipoOferta: '',
    imagen: ''
  };

  constructor(public dialog: MatDialog, private authRestauranteService: AuthrestauranteService) {}

  crearOferta() {
    const confirmation = confirm("¿Estás seguro de crear una nueva oferta?");
    if (confirmation) {
      if (this.camposVacios()== true || this.restauranteId === null || this.nombreRestaurante === null) {
        alert('Todos los campos son obligatorios.');
        console.log("Campos vacíos o 'restauranteId' es null.",this.restauranteId, this.camposVacios());
        return;
      }

      const formData = new FormData();
      formData.append('idRestaurante', this.restauranteId);
      formData.append('nombrerestaurante', this.nombreRestaurante);
      formData.append('titulo', this.nuevaOferta.titulo);
      formData.append('descripcion', this.nuevaOferta.descripcion);
      formData.append('precioOferta', this.nuevaOferta.precioOferta);
      formData.append('precioOriginal', this.nuevaOferta.precioOriginal);
      formData.append('TipoOferta', this.nuevaOferta.TipoOferta);

      this.imagen.forEach((imagen) => {
        formData.append('imagen', imagen);
        console.log("Imagen añadida al formulario:", imagen.name);
      });

      this.authRestauranteService.CrearOferta(formData).subscribe(
        (response) => {
          console.log('Oferta creada:', response);
          this.obtenerProductos();
          this.mostrarMensajeEmergente('Oferta creada correctamente.', '');
        },
        (error) => {
          console.error('Error al crear la oferta:', error);
          this.mostrarMensajeEmergente('Error al crear la oferta.', '');
        }
      );
    }
  }

  private camposVacios(): boolean {
    const hayCamposVacios = (
      !this.imagen.length || 
      !this.nuevaOferta.titulo.trim() ||
      !this.nuevaOferta.descripcion.trim() || 
      !this.nuevaOferta.precioOferta || 
      !this.nuevaOferta.precioOriginal || 
      !this.nuevaOferta.TipoOferta.trim()
    );
    console.log("¿Campos vacíos?", hayCamposVacios);
    return hayCamposVacios;
  }

  capturarImagenPrincipal(event: any): void {
    const imagenPrincipal = event.target.files[0];
    if (imagenPrincipal) {
      if (this.validarTipoYTamano(imagenPrincipal)) {
        this.imagen[0] = imagenPrincipal;
        console.log("Imagen principal capturada:", imagenPrincipal.name);
      } else {
        console.log("Error: La imagen principal debe ser de tipo JPEG o PNG y tener un tamaño máximo de 6MB.");
        alert('La imagen debe ser en formato jpg o png y no mayor a 6MB');
      }
    }
  }

  getImagenURL(imagenes: File): string {
    const url = URL.createObjectURL(imagenes);
    console.log("URL de la imagen generada:", url);
    return url;
  }

  validarTipoYTamano(archivo: File): boolean {
    const tipoPermitido = ['image/jpeg', 'image/png'];
    const tamañoMaximo = 6 * 1024 * 1024; 
    const esValido = tipoPermitido.includes(archivo.type) && archivo.size <= tamañoMaximo;
    console.log("¿Archivo válido?", esValido);
    return esValido;
  }

  eliminarOferta(index: number): void {
    const confirmation = confirm("¿Estás seguro de eliminar el producto?");
    if (confirmation) {
      const ofertaeliminar = this.ofertas[index];
  console.log(ofertaeliminar);
      this.idoferta = ofertaeliminar._id;
      console.log('ID Producto:', this.idoferta);
  
      // Elimina el producto del arreglo ofertas
      this.ofertas.splice(index, 1);
  
      // Llamada al servicio para eliminar la oferta en el backend
      this.authRestauranteService.eliminarOferta(this.idoferta).subscribe(
        (response) => {
          console.log('Producto eliminado correctamente:', response);
          this.mostrarMensajeEmergente('Producto eliminado correctamente', '');
        },
        (error) => {
          console.error('Error al eliminar el producto:', error);
        }
      );
    }
  }
  
  
  getImageUrl(relativePath: string): string {
    //const url = `http://localhost:3000/${relativePath}`;
    const url = `https://quickdinehub-back1.onrender.com/${relativePath}`;
    console.log("URL de la imagen obtenida:", url);
    return url;
  }

  private mostrarMensajeEmergente(mensaje: string, redireccion: string) {
    console.log('Mostrar mensaje:', mensaje, 'Redireccionar a:', redireccion);
    this.dialog.open(MensajeComponent, {
      width: '400px',
      data: { mensaje: mensaje, redireccion: redireccion }
    });
  }

  obtenerProductos(): void {
    this.authRestauranteService.getOfertas(this.restauranteId).subscribe(
      (Ofertas) => {
        this.ofertas = Ofertas;
        console.log("Ofertas obtenidas:", this.ofertas);
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }
}