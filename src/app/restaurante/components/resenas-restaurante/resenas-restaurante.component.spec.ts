import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResenasRestauranteComponent } from './resenas-restaurante.component';

describe('ResenasRestauranteComponent', () => {
  let component: ResenasRestauranteComponent;
  let fixture: ComponentFixture<ResenasRestauranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResenasRestauranteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResenasRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
