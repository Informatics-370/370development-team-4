import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FixedProductsPage } from './fixed-products.page';

describe('FixedProductsPage', () => {
  let component: FixedProductsPage;
  let fixture: ComponentFixture<FixedProductsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FixedProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
