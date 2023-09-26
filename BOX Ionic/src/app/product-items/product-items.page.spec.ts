import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductItemsPage } from './product-items.page';

describe('ProductItemsPage', () => {
  let component: ProductItemsPage;
  let fixture: ComponentFixture<ProductItemsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProductItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
