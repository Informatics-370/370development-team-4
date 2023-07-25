import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedProductComponent } from './fixed-product.component';

describe('FixedProductComponent', () => {
  let component: FixedProductComponent;
  let fixture: ComponentFixture<FixedProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FixedProductComponent]
    });
    fixture = TestBed.createComponent(FixedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
