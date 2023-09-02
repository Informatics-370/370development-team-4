import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeliveryScheduleComponent } from './order-delivery-schedule.component';

describe('OrderDeliveryScheduleComponent', () => {
  let component: OrderDeliveryScheduleComponent;
  let fixture: ComponentFixture<OrderDeliveryScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDeliveryScheduleComponent]
    });
    fixture = TestBed.createComponent(OrderDeliveryScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
