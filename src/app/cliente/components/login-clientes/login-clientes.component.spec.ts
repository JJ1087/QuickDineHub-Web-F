import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginClientesComponent } from './login-clientes.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('LoginClientesComponent', () => {
  let component: LoginClientesComponent;
  let fixture: ComponentFixture<LoginClientesComponent>;
  let authService: AuthService; // referencia del servicio

  beforeEach(() => {
    const authServiceMock = {
      login: jest.fn(), // Mockea el método login
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LoginClientesComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock } // mock de AuthService
      ]
    });
    
    fixture = TestBed.createComponent(LoginClientesComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService); // Inicializa el AuthService
    fixture.detectChanges();
  });


  it('formulario debe ser invalido cuando este vacio', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('debe validar el campo de email como requerido y con formato de email correcto', () => {
    const email = component.loginForm.controls['email'];
    
    // Campo vacío debe ser inválido
    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();

    // Correo no válido
    email.setValue('test');
    expect(email.hasError('email')).toBeTruthy();

    // Correo válido
    email.setValue('test@example.com');
    expect(email.valid).toBeTruthy();
  });

  it('debe validar el campo de contraseña como requerido', () => {
    const password = component.loginForm.controls['password'];

    // Campo vacío debe ser inválido
    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();

    // Contraseña válida
    password.setValue('123456');
    expect(password.valid).toBeTruthy();
  });

  it('debe iniciar sesión correctamente si el formulario es válido y AuthService devuelve éxito', async () => {
    // Cambia el retorno de la función login para que devuelva un Observable
    jest.spyOn(authService, 'login').mockReturnValue(of({ dataUser: true }));

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');
    fixture.detectChanges();

    await component.OnLogin(); // método OnLogin

    expect(authService.login).toHaveBeenCalled(); // Se Verifica que el método haya sido llamado
  });
  
});
