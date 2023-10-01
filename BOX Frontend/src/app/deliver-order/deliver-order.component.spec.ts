import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverOrderComponent } from './deliver-order.component';

describe('DeliverOrderComponent', () => {
  let component: DeliverOrderComponent;
  let fixture: ComponentFixture<DeliverOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliverOrderComponent]
    });
    fixture = TestBed.createComponent(DeliverOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
