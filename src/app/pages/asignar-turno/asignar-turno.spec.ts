import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarTurno } from './asignar-turno';

describe('AsignarTurno', () => {
  let component: AsignarTurno;
  let fixture: ComponentFixture<AsignarTurno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarTurno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarTurno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
