import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemTestComponent } from './product-item-test.component';

describe('ProductItemTestComponent', () => {
  let component: ProductItemTestComponent;
  let fixture: ComponentFixture<ProductItemTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductItemTestComponent]
    });
    fixture = TestBed.createComponent(ProductItemTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
