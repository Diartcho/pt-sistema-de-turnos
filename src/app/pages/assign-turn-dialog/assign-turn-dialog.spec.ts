import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTurnDialog } from './assign-turn-dialog';

describe('AssignTurnDialog', () => {
  let component: AssignTurnDialog;
  let fixture: ComponentFixture<AssignTurnDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignTurnDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignTurnDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
