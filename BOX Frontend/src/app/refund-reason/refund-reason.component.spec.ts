import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundReasonComponent } from './refund-reason.component';

describe('RefundReasonComponent', () => {
  let component: RefundReasonComponent;
  let fixture: ComponentFixture<RefundReasonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RefundReasonComponent]
    });
    fixture = TestBed.createComponent(RefundReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
