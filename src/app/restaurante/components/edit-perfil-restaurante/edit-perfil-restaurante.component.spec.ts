import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPerfilRestauranteComponent } from './edit-perfil-restaurante.component';

describe('EditPerfilRestauranteComponent', () => {
  let component: EditPerfilRestauranteComponent;
  let fixture: ComponentFixture<EditPerfilRestauranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPerfilRestauranteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPerfilRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
