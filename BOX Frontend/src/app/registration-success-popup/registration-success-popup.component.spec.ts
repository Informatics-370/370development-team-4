import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSuccessPopupComponent } from './registration-success-popup.component';

describe('RegistrationSuccessPopupComponent', () => {
  let component: RegistrationSuccessPopupComponent;
  let fixture: ComponentFixture<RegistrationSuccessPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationSuccessPopupComponent]
    });
    fixture = TestBed.createComponent(RegistrationSuccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
