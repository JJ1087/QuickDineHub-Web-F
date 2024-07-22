import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-edit-perfil-restaurante',
  templateUrl: './edit-perfil-restaurante.component.html',
  styleUrl: './edit-perfil-restaurante.component.css'
})
export class EditPerfilRestauranteComponent implements OnInit{
  editProfileForm: FormGroup;
  logoError: string | null = null;

  constructor(private fb: FormBuilder) {
    this.editProfileForm = this.fb.group({
      nombreRestaurante: [''],  // Sin validación
      correoRestaurante: ['', [Validators.email]],  // Solo validación de email
      telefonoRestaurante: ['', [Validators.pattern(/^\d{10}$/)]],  // Solo patrón de teléfono
      nombreEncargado: [''],  // Sin validación
      apellidoEncargado: [''],  // Sin validación
      contrasena: [''],  // Sin validación
      numeroRestaurante: [''],  // Sin validación
      logoRestaurante: [''],  // Sin validación
      horaApertura: [''],  // Sin validación
      horaCierre: ['']  // Sin validación
    });
  }

  ngOnInit(): void {
      // Cargar los datos del perfil existente aquí si es necesario
  }

  guardarCambios(): void {
      if (this.editProfileForm.valid) {
          // Lógica para guardar los cambios del perfil
          console.log(this.editProfileForm.value);
      }
  }

  onFileSelected(event: any): void {
      const file: File = event.target.files[0];
      if (file) {
          const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
          if (allowedTypes.includes(file.type)) {
              // Lógica para manejar el archivo seleccionado
              this.logoError = null;
          } else {
              this.logoError = 'Solo se permiten archivos PNG y JPEG';
          }
      }
  }
}
