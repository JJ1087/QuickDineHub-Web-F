/* eslint-disable @angular-eslint/no-empty-lifecycle-method */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-edit-perfil-repartidor',
  templateUrl: './edit-perfil-repartidor.component.html',
  styleUrl: './edit-perfil-repartidor.component.css'
})
export class EditPerfilRepartidorComponent implements OnInit{
  editarPerfilForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editarPerfilForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      preguntaSecreta: ['', Validators.required],
      respuestaSecreta: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.editarPerfilForm.valid) {
      const formData = this.editarPerfilForm.value;
      console.log('Formulario enviado', formData);
      // Aquí puedes agregar la lógica para enviar los datos al backend
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.editarPerfilForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('email')) {
      return 'Ingresa un correo electrónico válido';
    }
    return '';
  }
}
