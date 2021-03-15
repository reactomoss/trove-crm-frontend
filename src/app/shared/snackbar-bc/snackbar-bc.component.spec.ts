import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarBCComponent } from './snackbar-bc.component';

describe('SnackbarBCComponent', () => {
  let component: SnackbarBCComponent;
  let fixture: ComponentFixture<SnackbarBCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackbarBCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarBCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
