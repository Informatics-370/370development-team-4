import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListReportComponent } from './product-list-report.component';

describe('ProductListReportComponent', () => {
  let component: ProductListReportComponent;
  let fixture: ComponentFixture<ProductListReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListReportComponent]
    });
    fixture = TestBed.createComponent(ProductListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
