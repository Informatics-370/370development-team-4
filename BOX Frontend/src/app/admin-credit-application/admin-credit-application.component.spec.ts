import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreditApplicationComponent } from './admin-credit-application.component';

describe('AdminCreditApplicationComponent', () => {
  let component: AdminCreditApplicationComponent;
  let fixture: ComponentFixture<AdminCreditApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCreditApplicationComponent]
    });
    fixture = TestBed.createComponent(AdminCreditApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
