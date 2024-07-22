import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-perfil-cliente',
  templateUrl: './edit-perfil-cliente.component.html',
  styleUrl: './edit-perfil-cliente.component.css'
})
export class EditPerfilClienteComponent {
  editProfileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editProfileForm = this.fb.group({
      nombre: ['Guille Julio', Validators.required],
      correo: ['20200775@uthh.edu.mx', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      telefono: ['7711284100', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      preguntaSecreta: ['mascota', Validators.required],
      respuestaSecreta: ['Yusels', Validators.required]
    });
  }

  ngOnInit(): void {}

  guardarCambios(): void {
    if (this.editProfileForm.valid) {
      // Lógica para guardar cambios del perfil
      console.log(this.editProfileForm.value);
    }
  }

  cancelar(): void {
    // Lógica para cancelar la edición
    console.log('Edición cancelada');
  }

  toggleVozAlta(): void {
    // Lógica para habilitar/deshabilitar voz alta
  }

  getPromptLabel(): string {
    return 'Ingrese una contraseña';
  }
}
