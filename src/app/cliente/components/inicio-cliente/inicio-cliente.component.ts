// Al principio de tu archivo TypeScript
declare var webkitSpeechRecognition: any;
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SwPush } from '@angular/service-worker';
import { PreguntaSecretaService } from '../../../../app/compartido/services/preguntaSecreta.service';
 
@Component({
  selector: 'app-inicio-cliente',
  templateUrl: './inicio-cliente.component.html',
  styleUrl: './inicio-cliente.component.css'
})

export class InicioClienteComponent implements OnInit{//
  isOnline: boolean = navigator.onLine;
  offlineImageIcon: string = 'assets/sinconexion.png'; // Ruta al ícono de "Sin conexión"
  
  readonly VAPID_PUBLIC_KEY = 'BOpKJl1P-s-gcH5dhTqjzF6-KbB-D8lenn3kYMhhpvGEq1TLSFUpaOa6698F5ZLg0yGVbLqSBdhvuO7I94m8cMc';
  //{"publicKey":"BOpKJl1P-s-gcH5dhTqjzF6-KbB-D8lenn3kYMhhpvGEq1TLSFUpaOa6698F5ZLg0yGVbLqSBdhvuO7I94m8cMc","privateKey":"9HeLyr98wdMf1-sXyF5aducGyykqDP-D69nzIp1BgOA"}


  nombreusuario: string = '';
  comensalId: string = '';//TOMAR EL ID DEL CLIENTE EN LOCALSTORAGE en el futuro 
  currentIndex = 0;
  showMessage = false;
  showMessage1 = false;
  showWarning = false;
  searchTerm: string = ''; // Término de búsqueda
  productosFiltrados: any[] = []; // Lista de productos filtrados
  recognition: any;
  micIcon: HTMLElement | null = null;

    // Lista original de productos
    products: any[] = [
      // Agrega aquí tus productos
    ];
    

  images: string[] = [
    'assets/Hamburguesa.jpg',
    'assets/Tacos.jpg',
    'assets/Frappe.jpg', 
    'assets/Espagueti.jpg', 
    'assets/Hamburguesa.jpg', 
    'assets/Tacos.jpg', 
    'assets/gourmet.jpg', 
    'assets/pancakes.jpg', 
    'assets/mole.jpg', 
    'assets/bananasplit.jpg', 
  ];
  
  autoPlayInterval: any;
  private synth!: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null!;
  

  constructor(private router: Router, private authService: AuthService,
  private swPush: SwPush, private pushnotificacion: PreguntaSecretaService)
  {
    this.subscribeToNotifications();
  }//

  subscribeToNotifications(): void {
    // Verifica si las notificaciones push están habilitadas en el navegador
    if (!this.swPush.isEnabled) {
        console.log('Notificaciones push no están habilitadas en este navegador');
        return;
    }

    console.log('Solicitando suscripción...');
    
    // Solicitar la suscripción a las notificaciones push
    this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(sub => {
        console.log('Suscripción obtenida:', sub);  // Ver los detalles de la suscripción

        // Convertir la suscripción a un objeto (aunque normalmente ya es un objeto, por si acaso)
        const token = JSON.parse(JSON.stringify(sub));
        console.log('Token de suscripción:', token);  // Ver el token completo

        // Enviar la suscripción al servidor
        this.pushnotificacion.sendSubscription(token).subscribe(
            (res) => {
                console.log('Respuesta del servidor después de enviar la suscripción:', res);
            },
            (err) => {
                console.error('Error al enviar la suscripción al servidor:', err);
            }
        );
    }).catch(err => {
        // Captura errores durante la solicitud de la suscripción
        console.error('Error al solicitar la suscripción de notificaciones push:', err);
    });
}

  prevImage() {
    // Ajusta según la cantidad de imágenes que desees mostrar al mismo tiempo
    const imagesToShow = 3;
    // Calcula la cantidad de imágenes que se pueden mostrar sin espacios en blanco
    const maxIndex = this.images.length - imagesToShow;
    // Ajusta el índice teniendo en cuenta la cantidad de imágenes a mostrar
    this.currentIndex = (this.currentIndex - 1 + maxIndex) % maxIndex;
  }
  toggleVozAlta() {
    const enableVozAlta = document.getElementById('enableVozAlta') as HTMLInputElement;
    this.synth = window.speechSynthesis;
  
    const elementos = document.querySelectorAll('a, img, h1, p, h2, .title, .option, label, button' );
  
    elementos.forEach(elemento => {
      elemento.addEventListener('mouseover', () => {
        if (enableVozAlta.checked) {
          if (this.synth.speaking && this.utterance) {
            this.synth.cancel();
          }
  
          let texto = '';
  
          // Verificar si el elemento es una imagen antes de acceder a 'alt'
          if (elemento instanceof HTMLImageElement) {
            texto = elemento.alt;
          } else if (elemento instanceof HTMLElement) {
            texto = elemento.innerText || elemento.textContent || '';
          }
  
          if (texto.trim() !== '') {
            this.utterance = new SpeechSynthesisUtterance(texto);
            this.synth.speak(this.utterance);
          }
        }
      });
    });
  }
  nextImage() {
    // Ajusta según la cantidad de imágenes que desees mostrar al mismo tiempo
    const imagesToShow = 3;
    // Calcula la cantidad de imágenes que se pueden mostrar sin espacios en blanco
    const maxIndex = this.images.length - imagesToShow;
    // Ajusta el índice teniendo en cuenta la cantidad de imágenes a mostrar
    this.currentIndex = (this.currentIndex + 1) % maxIndex;
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextImage();
    }, 2000); // Cambia la imagen cada 2 segundos (ajusta según sea necesario)
  }

  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }

  onMouseEnter() {
    this.stopAutoPlay();
  }

  onMouseLeave() {
    this.startAutoPlay();
  }

//----------------Agregar al carrito-------------------------------------------------------

  carrito: { productId: string, idRestaurante: string }[] = [];

  addToCart(productId: string, idRestaurante: string) {

    console.log('Elementos en el carrito: ', this.carrito);
      // Verificar si el ID del producto ya está en el carrito
    if (this.carrito.some(item => item.productId === productId && item.idRestaurante === idRestaurante)) {

      this.showMessage1 = true;

      setTimeout(() => {
          this.showMessage1 = false; 
      }, 3000);
      console.log('Ya esta en el carro');


    }else{

      // Agregar el ID del producto al arreglo del carrito
      console.log('Lo que se va a agregar: ', productId, idRestaurante);
      console.log('COMO ENTRA EN FRONT : ', this.carrito);
      this.carrito.push({productId, idRestaurante});
      console.log('COMO SALE EN FRONT: ', this.carrito);

        // Llamar al servicio para guardar el carrito en la base de datos
      this.authService.guardarCarrito(this.comensalId, this.carrito).subscribe(
        (response) => {
          // Éxito al guardar el carrito en la base de datos
          console.log('Carrito guardado exitosamente en la base de datos');
        },
        (error) => {
          // Manejar errores
          console.error('Error al guardar el carrito:', error);
        }
      );
      
      this.showMessage = true;

      setTimeout(() => {
          this.showMessage = false; 
      }, 4000);

    }
    
  }


  goToCart() {
    // Redireccionar a la página del carrito de compras
    this.router.navigate(['/carrito-clienteG']);
  }

// Modificar la función obtenerRestaurante para que acepte una lista de IDs de restaurante----------------------------
restaurantes: { [idRestaurante: string]: any } = {};

obtenerRestaurante(idsRestaurante: string[]) {
  idsRestaurante.forEach(idRestaurante => {
    this.authService.obtenerRestaurante(idRestaurante).subscribe(
      (data) => {
        // Almacena la información del restaurante
        this.restaurantes[idRestaurante] = data;
        console.log('datos del restaurante: ', this.restaurantes );
      },
      (error) => {
        console.error('Error al obtener info del restaurante:', error);
      }
    );
  });
}

//------------------------------------------------------------------------------------------
isRestaurantOpen(idRestaurante: string): boolean {
  const restaurante = this.restaurantes[idRestaurante];
  if (!restaurante) {
      return false; // Si no se encuentra la información del restaurante, se considera cerrado
  }
  const horaActual = this.obtenerHoraActual();
  return horaActual >= restaurante.horaApertura && horaActual <= restaurante.horaCierre;
}

obtenerHoraActual(): string {
  const ahora = new Date();
  const hora = ahora.getHours().toString().padStart(2, '0'); // Obtener la hora en formato de 2 dígitos
  const minutos = ahora.getMinutes().toString().padStart(2, '0'); // Obtener los minutos en formato de 2 dígitos
  return `${hora}:${minutos}`;
}


//-------------------------------------------------------------------------------------------

   ngOnInit(): void {
    
    if (typeof window !== 'undefined' && localStorage !== null) {

      window.addEventListener('online', this.updateOnlineStatus.bind(this));
      window.addEventListener('offline', this.updateOnlineStatus.bind(this));
   
      this.micIcon = document.getElementById('micIcon'); 
      this.comensalId = localStorage.getItem('ID_USER') || '';
      if (this.comensalId) {
        this.nombreusuario = localStorage.getItem('NOMBRE')|| '';
      } else {
        console.error("No se encontró 'ID_USER' en localStorage.");
      }
   
      this.authService.obtenerInfoDeProducto().subscribe((products: any[]) => {
        console.log('Productos:', products);
        this.products = products; 
        this.filtrarProductos(); // Filtrar productos al cargar la lista
  
        const idsRestaurante: string[] = Array.from(new Set(products.map(product => product.idRestaurante)));
        this.obtenerRestaurante(idsRestaurante);
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
        this.registrarErrorEnBD('Error al obtener los productos', 'inicio-cliente.component.ts:166 GET https://quickdinehub-back1.onrender.com/info-producto1 404 (Not Found)');
      });
  
      this.obtenerOrdenes();
      this.obtenerDatoComensal();
    } else {
      console.error("El entorno no admite 'localStorage'.");


    } //schedule

  }

  updateOnlineStatus(): void {
    this.isOnline = navigator.onLine;
  }
  
  // Activar la búsqueda por voz
  activarBusquedaVoz() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = 'es-ES'; // Idioma de reconocimiento
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      // Cambiar el icono del micrófono
      this.micIcon?.classList.add('active');

      // Iniciar el reconocimiento de voz
      this.recognition.start();

      this.recognition.onstart = () => {
        console.log('Reconocimiento de voz iniciado');
        this.micIcon?.classList.add('active');
      };

      this.recognition.onend = () => {
        console.log('Reconocimiento de voz finalizado');
        this.micIcon?.classList.remove('active');
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error en el reconocimiento de voz:', event.error);
        this.micIcon?.classList.remove('active');
      };

      // Obtener el resultado de la búsqueda
      this.recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        console.log('Resultado del reconocimiento de voz:', result);

        // Asignar el resultado al término de búsqueda
        this.searchTerm = result.endsWith('.') ? result.slice(0, -1) : result;

        // Filtrar los productos según el término de búsqueda
        this.filtrarProductos();
      };
    } else {
      console.log('API de reconocimiento de voz no compatible con este navegador');
    }
  }


// Filtrar productos
filtrarProductos() {
  if (this.searchTerm.trim() !== '') {
    this.productosFiltrados = this.products.filter(product =>
      product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  } else {
    // Si no hay búsqueda, limpia los productos filtrados para no mostrarlos
    this.productosFiltrados = [];
  }
}
  


//REGISTRO DE ERROR EN LOGS----------------------------------------------------------------------
   registrarErrorEnBD(errorDetails: string, errorType: string): void {
    this.authService.registrarError(errorDetails, errorType).subscribe(
      (response) => {
        console.log('Error registrado correctamente en el backend');
        console.log('RESPUESTAS DEL BACK',response.mensaje);
        if (response.mensaje === 'Advertencia') {
          // Activa el mensaje de advertencia en el frontend
          alert('Mandar Correo a admin'); 
          
        }

      },
      (error) => {
        console.error('Error al registrar el error:', error);
      }
    );
  }



    // Método para generar la URL completa de la imagen www
    getImageUrl(relativePath: string): string {
      return this.isOnline ? `https://quickdinehub-back1.onrender.com/${relativePath}` : this.offlineImageIcon;//return `http://localhost:3000/${relativePath}`;
    }

//Funcion para llamar a mis ordenes--------------------------------------------------------------------------

    ordenes: any[] = [];
    ordenesConEstadoUno: any[] = [];
    ordenesConEstadoDos: any[] = [];
    ordenesConEstadoSiete: any[] = [];
    obtenerOrdenes() {
    

    if (this.comensalId) {
     // Llama a la función del servicio para obtener las direcciones desde el backend
     this.authService.obtenerOrdenes(this.comensalId).subscribe(
       (data) => {
         // Actualiza la lista de ordenes con los datos obtenidos
         this.ordenes = data;
         console.log('Ordenes recibidas', this.ordenes);
         
        // Filtra las órdenes para encontrar aquellas con estadoOrden igual a 2
        this.ordenesConEstadoDos = this.ordenes.filter((orden: any) => orden.estadoOrden === 2);
        console.log('Ordenes con estadoOrden igual a 2:', this.ordenesConEstadoDos);

        // Filtra las órdenes para encontrar aquellas con estadoOrden igual a 1
        this.ordenesConEstadoUno = this.ordenes.filter((orden: any) => orden.estadoOrden === 1);
        console.log('Ordenes con estadoOrden igual a 1:', this.ordenesConEstadoDos);

        // Filtra las órdenes para encontrar aquellas con estadoOrden igual a 7 esperando a finalizar la entrega
        this.ordenesConEstadoSiete = this.ordenes.filter((orden: any) => orden.estadoOrden === 7);
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

//-----------------Traer datos del cliente-----------------------------------------------------------
   cliente: any;

  obtenerDatoComensal() {
    console.log('Elementos en el carrito: ', this.carrito);
    if (this.comensalId) {
     // Llama a la función del servicio para obtener las direcciones desde el backend
     this.authService.obtenerDatoComensal(this.comensalId).subscribe(
       (data) => {
         // Actualiza la lista de direcciones con los datos obtenidos
         this.cliente = data;
         console.log('Datos comensal recibidas', this.cliente);

         // Actualiza la variable carrito con los datos del carrito del comensal
          this.carrito = this.cliente.carrito;
          console.log('Carrito del comensal:', this.carrito);
         
       },
       (error) => {
         console.error('Error al obtener las direcciones:', error);
         
         // Maneja el error según sea necesario
       }
     );

    }else{
      console.log('No se esta recibiendo el id del cliente');
    }
   }

   actualizarOrdenes(): void {
    console.log('Ejecutando actualizacion de ordenes');
    this.obtenerOrdenes();
    console.log('Si se pudo tilin');
}

formatTime(time: string): string {
  const parts = time.split(':');
  const hour = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const suffix = hour >= 12 ? 'pm' : 'am';
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minutes < 10 ? '0' + minutes : minutes} ${suffix}`;
}
}
