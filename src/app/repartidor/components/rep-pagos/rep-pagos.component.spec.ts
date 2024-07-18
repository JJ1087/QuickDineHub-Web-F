import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepPagosComponent } from './rep-pagos.component';

describe('RepPagosComponent', () => {
  let component: RepPagosComponent;
  let fixture: ComponentFixture<RepPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RepPagosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
