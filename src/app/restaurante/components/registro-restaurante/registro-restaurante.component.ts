
// registro-restaurante.component.ts
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MensajeComponent } from '../../../compartido/components/mensaje/mensaje.component';
import { AuthrestauranteService } from '../../services/authrestaurante.service';

@Component({
  selector: 'app-registro-restaurante',
  templateUrl: './registro-restaurante.component.html',
  styleUrls: ['./registro-restaurante.component.css']
})
export class RegistroRestauranteComponent implements OnInit {

  // Atributos para mostrar las imágenes previas
  public prevMenu: string = '';
  public previdentificacionOficial: string = '';
  public prevconstanciaFiscal: string = '';
  public prevestadoCuentaBancaria: string = '';
  public prevlicenciaFuncionamiento: string = '';

  // Arreglos para almacenar los archivos seleccionados
  public menuImagenFile: any = [];
  public identificacionOficialFile: any = [];
  public constanciaFiscalFile: any = [];
  public estadoCuentaBancariaFile: any = [];
  public licenciaFuncionamientoFile: any = [];

  // Definición de formularios y variables de control
  registroForm: FormGroup;
  segundaFaseForm: FormGroup;
  terceraFaseForm: FormGroup;
  cuartaFaseForm: FormGroup;

  
  isCaptchaVerified: boolean = false;
  recaptchaSiteKey: string = '6Le6alYpAAAAAHIWXN8HgHQ19z60gq0e3YCSz5qY';
  mostrarModalAvisosPrivacidad: boolean = false; // Variable para mostrar/ocultar el modal
  private synth!: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null!;

  hidePassword: boolean = true; // Variable para ocultar/mostrar contraseña
  faseActual: 'primera' | 'segunda' | 'tercera' | 'cuarta' = 'primera'; // Variable para controlar la fase del registro

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private authRestauranteService: AuthrestauranteService,
 
  ) {
    // Inicialización de formularios
    this.registroForm = this.fb.group({
      nombreRestaurante: ['', Validators.required],
      correoRestaurante: ['', [Validators.required, Validators.email]],
      telefonoRestaurante: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      encargadoRestaurante: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      direccionRestaurante: ['', Validators.required],
      apellidoEncargado: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d#$&*]{8,}$/)]],
      preguntaSecreta: ['', Validators.required], // Agrega la pregunta secreta al formulario
      respuestaSecreta: ['', Validators.required], // Agrega la respuesta secreta al formulario
    });

    this.segundaFaseForm = this.fb.group({
      numeroRestaurante: ['', Validators.required],
      razonSocial: ['', Validators.required],
      domicilioFiscal: ['', Validators.required],
      horaApertura: ['', Validators.required],
      horaCierre: ['', Validators.required],
      aceptarPrivacidad: [false, Validators.requiredTrue],
      menuImagen: [null, Validators.required], // Campo de carga de archivo
    });

    this.terceraFaseForm = this.fb.group({
      nombreTitular: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      numeroCLABE: ['', Validators.required],
    });

    this.cuartaFaseForm = this.fb.group({
      identificacionOficial: [null, Validators.required], // Campo de carga de archivo
      constanciaFiscal: [null, Validators.required], // Campo de carga de archivo
      estadoCuentaBancaria: [null, Validators.required], // Campo de carga de archivo
      licenciaFuncionamiento: [null, Validators.required], // Campo de carga de archivo
    });
  }

  ngOnInit(): void {}

  handleCaptchaChange(value: string | null) {
    this.isCaptchaVerified = value !== null;
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

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.setAttribute('type', this.hidePassword ? 'password' : 'text');
    }
  }

  mostrarAvisosPrivacidad() {
    // Muestra el modal de AvisosPrivacidadComponent solo si aún no está visible
    if (!this.mostrarModalAvisosPrivacidad) {
      this.mostrarModalAvisosPrivacidad = true;
    }
  }
  
  cerrarAvisosPrivacidad() {
    // Cierra el modal de AvisosPrivacidadComponent
    this.mostrarModalAvisosPrivacidad = false;
  }

  cambiarFase(fase: 'primera' | 'segunda' | 'tercera' | 'cuarta') {
    this.faseActual = fase;
  }

  volverAFaseAnterior() {
    this.cambiarFase('primera');
  }

  // Métodos para capturar imágenes y mostrar vistas previas
  capturarImagenmenu(event: any) {
    const menuImagencapturado = event.target.files[0];
    this.extraerBase64(menuImagencapturado).then((imagen: any) => {
      this.prevMenu = imagen.base;
    })
    this.menuImagenFile.push(menuImagencapturado);
  }

  capturarImagenidentificacionOficial(event: any) {
    const identificacionOficialcapturado = event.target.files[0];
    this.extraerBase64(identificacionOficialcapturado).then((imagen: any) => {
      this.previdentificacionOficial = imagen.base;
    })
    this.identificacionOficialFile.push(identificacionOficialcapturado);
  }

  capturarImagenconstanciaFiscal(event: any) {
    const constanciaFiscacapturado = event.target.files[0];
    this.extraerBase64(constanciaFiscacapturado).then((imagen: any) => {
      this.prevconstanciaFiscal = imagen.base;
    })
    this.constanciaFiscalFile.push(constanciaFiscacapturado);
  }

  capturarImagenestadoCuentaBancaria(event: any) {
    const estadoCuentaBancariacapturado = event.target.files[0];
    this.extraerBase64(estadoCuentaBancariacapturado).then((imagen: any) => {
      this.prevestadoCuentaBancaria = imagen.base;
    })
    this.estadoCuentaBancariaFile.push(estadoCuentaBancariacapturado);
  }

  capturarImagenlicenciaFuncionamiento(event: any) {
    const licenciaFuncionamientocapturado = event.target.files[0];
    this.extraerBase64(licenciaFuncionamientocapturado).then((imagen: any) => {
      this.prevlicenciaFuncionamiento = imagen.base;
    })
    this.licenciaFuncionamientoFile.push(licenciaFuncionamientocapturado);
  }

  extraerBase64($event: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const reader = new FileReader();

        reader.onload = () => {
          resolve({
            blob: $event,
            image: unsafeImg,
            base: reader.result
          });
        };

        reader.onerror = error => {
          reject(error);
        };

        reader.readAsDataURL($event);
      } catch (e) {
        reject(e);
      }
    });
  }

  // Métodos para registrar el restaurante en cada fase
  registrar(): void {
    if (this.registroForm.valid) {
      console.log('Información registrada:', this.registroForm.value);
      this.cambiarFase('segunda');
    }
  }

  registrarFaseDos(): void {
    if (this.segundaFaseForm.valid) {
      console.log('Información registrada:', this.segundaFaseForm.value);
      this.cambiarFase('tercera');
    }
  }

  registrarFaseTres(): void {
    if (this.terceraFaseForm.valid) {
      console.log('Información registrada:', this.terceraFaseForm.value);
      this.cambiarFase('cuarta');
    }
  }

  registrarFaseCuatro(): void {
    try {
      if (this.cuartaFaseForm.valid) {
        console.log('Datos del formulario de la cuarta fase:', this.cuartaFaseForm.value);
  
        const RestauranteDatos = new FormData();
        RestauranteDatos.append('nombreRestaurante', this.registroForm.get('nombreRestaurante')?.value);
        RestauranteDatos.append('correoRestaurante', this.registroForm.get('correoRestaurante')?.value);
        RestauranteDatos.append('telefonoRestaurante', this.registroForm.get('telefonoRestaurante')?.value);
        RestauranteDatos.append('encargadoRestaurante', this.registroForm.get('encargadoRestaurante')?.value);
        RestauranteDatos.append('apellidoEncargado', this.registroForm.get('apellidoEncargado')?.value);
        RestauranteDatos.append('direccionRestaurante', this.registroForm.get('direccionRestaurante')?.value);
        RestauranteDatos.append('contrasena', this.registroForm.get('contrasena')?.value);
        RestauranteDatos.append('numeroPreguntaSecreta', this.registroForm.get('preguntaSecreta')?.value);
        RestauranteDatos.append('respuestaSecreta', this.registroForm.get('respuestaSecreta')?.value);
        RestauranteDatos.append('numeroRestaurante', this.segundaFaseForm.get('numeroRestaurante')?.value);
        RestauranteDatos.append('razonSocial', this.segundaFaseForm.get('razonSocial')?.value);
        RestauranteDatos.append('domicilioFiscal', this.segundaFaseForm.get('domicilioFiscal')?.value);
        RestauranteDatos.append('nombreTitular', this.terceraFaseForm.get('nombreTitular')?.value);
        RestauranteDatos.append('direccion', this.terceraFaseForm.get('direccion')?.value);
        RestauranteDatos.append('ciudad', this.terceraFaseForm.get('ciudad')?.value);
        RestauranteDatos.append('codigoPostal', this.terceraFaseForm.get('codigoPostal')?.value);
        RestauranteDatos.append('numeroCLABE', this.terceraFaseForm.get('numeroCLABE')?.value);
        RestauranteDatos.append('horaApertura', this.segundaFaseForm.get('horaApertura')?.value);
        RestauranteDatos.append('horaCierre', this.segundaFaseForm.get('horaCierre')?.value);
        
        // Agregar imágenes solo si están presentes
        RestauranteDatos.append('menuImagen', this.menuImagenFile[0]);
        RestauranteDatos.append('identificacionOficial', this.identificacionOficialFile[0]);
        RestauranteDatos.append('constanciaFiscal', this.constanciaFiscalFile[0]);
        RestauranteDatos.append('estadoCuentaBancaria', this.estadoCuentaBancariaFile[0]);
        RestauranteDatos.append('licenciaFuncionamiento', this.licenciaFuncionamientoFile[0]);
        console.log('Datos del formulario:', RestauranteDatos);
  
        this.authRestauranteService.RegistroRestaurante(RestauranteDatos).subscribe(
          (response) => {
            this.mostrarMensajeEmergente();
            this.router.navigate(['/login-restaurante']);
          },
          (error) => {
            console.error('Error en el registro:', error);
            // Manejar el error según sea necesario
          }
        );
      } else {
        console.error('El formulario no es válido');
      }
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
    }
  }
  private mostrarMensajeEmergente() {
    this.dialog.open(MensajeComponent, {
      width: '400px',
      data: { mensaje: 'RESTAURANTE CREADO EXITOSAMENTE!!!' }
    });
  }

  navegarACuartaFase() {
    // Puedes realizar validaciones adicionales aquí si es necesario
    this.cambiarFase('cuarta');
  }
  
  getErrorMessage(controlName: string): string {
    const control = this.registroForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Campo obligatorio';
    }

    if (controlName === 'telefono' && control?.hasError('pattern')) {
      return 'El número de teléfono debe tener 10 dígitos';
    }

    if (controlName === 'correo' && control?.hasError('email')) {
      return 'Correo electrónico no válido';
    }

    if (controlName === 'contrasena' && control?.hasError('pattern')) {
      return 'La contraseña debe tener entre 8 y 16 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &)';
    }

    return '';
  }
}
