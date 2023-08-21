import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveCustomerListComponent } from './inactive-customer-list.component';

describe('InactiveCustomerListComponent', () => {
  let component: InactiveCustomerListComponent;
  let fixture: ComponentFixture<InactiveCustomerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InactiveCustomerListComponent]
    });
    fixture = TestBed.createComponent(InactiveCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
