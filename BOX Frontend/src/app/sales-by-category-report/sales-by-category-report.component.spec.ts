import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByCategoryReportComponent } from './sales-by-category-report.component';

describe('SalesByCategoryReportComponent', () => {
  let component: SalesByCategoryReportComponent;
  let fixture: ComponentFixture<SalesByCategoryReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesByCategoryReportComponent]
    });
    fixture = TestBed.createComponent(SalesByCategoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
