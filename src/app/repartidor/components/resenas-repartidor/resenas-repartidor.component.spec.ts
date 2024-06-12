import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResenasRepartidorComponent } from './resenas-repartidor.component';

describe('ResenasRepartidorComponent', () => {
  let component: ResenasRepartidorComponent;
  let fixture: ComponentFixture<ResenasRepartidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResenasRepartidorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResenasRepartidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
