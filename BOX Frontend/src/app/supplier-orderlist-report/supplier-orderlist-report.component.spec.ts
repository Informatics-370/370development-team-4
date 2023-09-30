import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOrderlistReportComponent } from './supplier-orderlist-report.component';

describe('SupplierOrderlistReportComponent', () => {
  let component: SupplierOrderlistReportComponent;
  let fixture: ComponentFixture<SupplierOrderlistReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierOrderlistReportComponent]
    });
    fixture = TestBed.createComponent(SupplierOrderlistReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
