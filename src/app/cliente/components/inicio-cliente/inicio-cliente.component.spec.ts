/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioClienteComponent } from './inicio-cliente.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Declaración global para SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any; // Agregar esta línea si usas webkitSpeechRecognition
  }
}

describe('InicioClienteComponent', () => {
  let component: InicioClienteComponent;
  let fixture: ComponentFixture<InicioClienteComponent>;
  let mockSpeechRecognition: any; // Mock de SpeechRecognition

  beforeEach(() => {
    // Crear un mock para SpeechRecognition
    mockSpeechRecognition = {
      start: jest.fn(),
      stop: jest.fn(),
      onresult: jest.fn(),
      onerror: jest.fn(),
    };

    // Moquear el window.webkitSpeechRecognition
    window.webkitSpeechRecognition = jest.fn(() => mockSpeechRecognition);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [InicioClienteComponent],
    }).compileComponents();
    
    fixture = TestBed.createComponent(InicioClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //------------------------------BUSQUEDA POR VOZ------------------------------------------------

  // Test para verificar que el componente se cree correctamente
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /// Test para verificar que se inicie el reconocimiento de voz
  it('Iniciar el reconocimiento de voz cuando se activa la búsqueda por voz', () => {
    component.activarBusquedaVoz(); // Método que inicia la búsqueda por voz
    expect(mockSpeechRecognition.start).toHaveBeenCalled(); // Verificar que se llama a start
  });

  // Test para simular un resultado de voz
  it('should process the result when voice recognition returns a transcript', () => {
    const mockEvent = {
      results: [
        [
          { transcript: 'pollo' } // Simular que el usuario dijo "pizza"
        ]
      ]
    };
    
    // Asignar el mock de onresult al componente
    mockSpeechRecognition.onresult(mockEvent);
    
    // Simular la llamada a startVoiceSearch
    component.activarBusquedaVoz(); // Iniciar la búsqueda por voz
    
    // Llamar manualmente al manejador de resultados
    mockSpeechRecognition.onresult(mockEvent); // Simular el evento de resultado

    expect(component.searchTerm).toBe('pollo'); // Verificar que el resultado es "pizza"
  });

  //------------------------------------BUSQUEDA ESCRITA---------------------------------


  //Test para verificar el filtrado correcto de productos
  it('filtrar los productos en función del término de búsqueda', () => {
    component.products = [
      { nombre: 'Pollo' },
      { nombre: 'Pizza' },
      { nombre: 'Pasta' },
    ];
    component.searchTerm = 'piz'; // Término de búsqueda parcial
    
    component.filtrarProductos(); // Ejecuta la función de filtrado
    
    expect(component.productosFiltrados).toEqual([{ nombre: 'Pizza' }]);
  });
  
  //Test para verificar el filtrado con un término que no coincide
  it('verificar el filtrado con un término que no coincide', () => {
    component.products = [
      { nombre: 'Pollo' },
      { nombre: 'Pizza' },
      { nombre: 'Pasta' },
    ];
    component.searchTerm = 'ensalada'; // Término de búsqueda sin coincidencias
    
    component.filtrarProductos();
    
    expect(component.productosFiltrados).toEqual([]); // Debe estar vacío
  });
  
  //Test para verificar que el filtrado sea insensible a mayúsculas y minúsculas
  it('verificar que el filtrado sea insensible a mayúsculas y minúsculas', () => {
    component.products = [
      { nombre: 'Pollo' },
      { nombre: 'pizza' },
      { nombre: 'Pasta' },
    ];
    component.searchTerm = 'PIZZA'; // En mayúsculas
    
    component.filtrarProductos();
    
    expect(component.productosFiltrados).toEqual([{ nombre: 'pizza' }]);
  });
  

});
