import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteOffByProductCategoryComponent } from './write-off-by-product-category.component';

describe('WriteOffByProductCategoryComponent', () => {
  let component: WriteOffByProductCategoryComponent;
  let fixture: ComponentFixture<WriteOffByProductCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WriteOffByProductCategoryComponent]
    });
    fixture = TestBed.createComponent(WriteOffByProductCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
