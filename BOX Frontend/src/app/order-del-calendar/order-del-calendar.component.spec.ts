import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDelCalendarComponent } from './order-del-calendar.component';

describe('OrderDelCalendarComponent', () => {
  let component: OrderDelCalendarComponent;
  let fixture: ComponentFixture<OrderDelCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDelCalendarComponent]
    });
    fixture = TestBed.createComponent(OrderDelCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
