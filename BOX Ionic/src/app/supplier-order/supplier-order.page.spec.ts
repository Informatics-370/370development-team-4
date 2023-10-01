import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierOrderPage } from './supplier-order.page';

describe('SupplierOrderPage', () => {
  let component: SupplierOrderPage;
  let fixture: ComponentFixture<SupplierOrderPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SupplierOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
