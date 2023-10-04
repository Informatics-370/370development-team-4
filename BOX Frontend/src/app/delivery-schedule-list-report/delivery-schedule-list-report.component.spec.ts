import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryScheduleListReportComponent } from './delivery-schedule-list-report.component';

describe('DeliveryScheduleListReportComponent', () => {
  let component: DeliveryScheduleListReportComponent;
  let fixture: ComponentFixture<DeliveryScheduleListReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryScheduleListReportComponent]
    });
    fixture = TestBed.createComponent(DeliveryScheduleListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
