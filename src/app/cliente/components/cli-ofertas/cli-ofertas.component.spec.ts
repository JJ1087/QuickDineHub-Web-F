import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CliOfertasComponent } from './cli-ofertas.component';

describe('CliOfertasComponent', () => {
  let component: CliOfertasComponent;
  let fixture: ComponentFixture<CliOfertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CliOfertasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CliOfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
