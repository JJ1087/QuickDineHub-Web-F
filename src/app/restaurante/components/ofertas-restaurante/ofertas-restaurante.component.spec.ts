import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasRestauranteComponent } from './ofertas-restaurante.component';

describe('OfertasRestauranteComponent', () => {
  let component: OfertasRestauranteComponent;
  let fixture: ComponentFixture<OfertasRestauranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfertasRestauranteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OfertasRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
