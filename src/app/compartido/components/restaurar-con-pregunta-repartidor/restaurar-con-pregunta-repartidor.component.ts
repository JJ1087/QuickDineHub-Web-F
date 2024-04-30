import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistroRepartidorService } from '../../../repartidor/services/registro-repartidor.service';
import { PreguntaSecretaService } from '../../services/preguntaSecreta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurar-con-pregunta-repartidor',
  templateUrl: './restaurar-con-pregunta-repartidor.component.html',
  styleUrl: './restaurar-con-pregunta-repartidor.component.css'
})
export class RestaurarConPreguntaRepartidorComponent {
  faseActual: number = 0; // Definir la propiedad faseActual y asignarle un valor
  fase1Form!: FormGroup; // Debes definir el FormGroup para el formulario
  fase2Form!: FormGroup; 
  fase3Form!: FormGroup; 
  recuperarCuentaForm!: FormGroup;
  public codigo: string = '';
  errorFase1: boolean = false; // Nuevo
  errorFase2: boolean = false; // Nuevo

  constructor(private formBuilder: FormBuilder, private registroService: RegistroRepartidorService, private preguntaSecretaService: PreguntaSecretaService,private router: Router  ) { }

  ngOnInit(): void {
    this.recuperarCuentaForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.fase1Form = this.formBuilder.group({
      preguntaSecreta: ['', Validators.required],
      respuestaSecreta: ['', Validators.required]
    });

    this.fase2Form = this.formBuilder.group({
      claveAutenticacion: ['', Validators.required], // Definir los controles del formulario
    });

    this.fase3Form = this.formBuilder.group({
      nuevaContraseña: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)]],
      confirmacionContraseña: ['', Validators.required]
    }, {validator: this.contraseñasCoinciden});

  }

  contraseñasCoinciden(fg: FormGroup): {[key: string]: boolean} | null {
  const nuevaContraseña = fg.get('nuevaContraseña')?.value;
  const confirmacionContraseña = fg.get('confirmacionContraseña')?.value;
  if (nuevaContraseña !== confirmacionContraseña) {
    return {'noCoinciden': true};
  }
  return null;
}

  
onSubmit(): void {
  if (this.recuperarCuentaForm.valid) {
    // Aquí puedes manejar la lógica para enviar la clave de autenticación al correo electrónico ingresado
    console.log('Correo electrónico :', this.recuperarCuentaForm.value.email);
    this.faseActual = 1;
   
   console.log('Correo electrónico :', this.recuperarCuentaForm.value.email);
  } else {
    console.log('Formulario no válido');
  }
}
onFase1Submit(): void {
    // Obtener el correo electrónico del formulario de recuperación
    const email = this.recuperarCuentaForm.value.email;
    
    // Solicitar la pregunta secreta y la respuesta secreta asociada al correo electrónico
    this.preguntaSecretaService.obtenerPreguntaYRespuestaSecretaRepartidor(email).subscribe(
      (data) => {
        const preguntaSecreta = data.preguntaSecreta;
        const respuestaSecreta = data.respuestaSecreta;

        // Comparar la respuesta ingresada por el usuario con la respuesta secreta obtenida
        if (this.fase1Form.value.respuestaSecreta === respuestaSecreta && this.fase1Form.value.preguntaSecreta === preguntaSecreta ) {
          console.log('valores correctos');
          //enviar codigo : 
          this.generarCodigoYEnviarCorreo();
          // Realizar acciones adicionales si la respuesta es correcta
          this.errorFase1 = false; // Reiniciar el estado de error
          this.faseActual=2;
        } else {
          console.log('valores incorrectos  ');

          // Realizar acciones si la respuesta es incorrecta
          this.errorFase1 = true; // Activar el estado de error cuando la respuesta es incorrecta
        }
      },
      (error) => {
        console.error('Error al obtener la pregunta secreta y la respuesta secreta:', error);
        // Manejar el error
      }
    );
    
}

  // Método para manejar el envío del formulario
  onFase2Submit(): void {
    const codigoIngresado = this.fase2Form.get('claveAutenticacion')?.value;
    const codigoEnviado = this.codigo;

    if (codigoIngresado === codigoEnviado) {      // Realizar acciones necesarias cuando se envía el formulario
      console.log('Formulario enviado con éxito');
      this.faseActual = 3;
      this.errorFase2 = false; // Asegúrate de reiniciar el estado de error cuando sea correcto

    } else {
      // Manejar el caso cuando el formulario no es válido
      console.log('El formulario no es válido');
      this.errorFase2 = true; // Activar el error cuando el código no coincide
    }
  }


    onFase3Submit(): void {
      if (this.fase3Form.valid) {
        const email = this.recuperarCuentaForm.get('email')?.value;
        const nuevaContraseña = this.fase3Form.get('nuevaContraseña')?.value;

        // Aquí invocarías el método del servicio para cambiar la contraseña
        this.preguntaSecretaService.cambiarContraseñaRepartidor(email, nuevaContraseña).subscribe(
          () => {
            this.router.navigate(['/login-repartidores']);
            console.log('Contraseña cambiada exitosamente');
            alert('La contraseña ha sido cambiada con éxito.');
          },
          error => {
            console.error('Error al cambiar la contraseña:', error);
          }
        );
      } else {
        console.log('Formulario de cambio de contraseña no válido');
      }
    }

  generarCodigoYEnviarCorreo() {
    const email = this.recuperarCuentaForm.get('email')?.value;
    this.codigo = this.generateAuthenticationCode();

    // Envía el código por correo electrónico
    this.preguntaSecretaService.enviarCorreoAutenticacion(email, this.codigo)
      .subscribe(
        () => {
          console.log('Correo electrónico enviado exitosamente');
          // Aquí puedes realizar alguna acción adicional si es necesario
        },
        error => {
          console.error('Error al enviar el correo electrónico:', error);
        }
      );
  }

  generateAuthenticationCode(): string {
    const length = 6; // Longitud del código de autenticación
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Caracteres permitidos
    let code = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
  
    return code;
    }

  volverAFase1(): void {
    this.faseActual = 0;
  }
}
