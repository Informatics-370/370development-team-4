import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostPriceFormulaComponent } from './cost-price-formula.component';

describe('CostPriceFormulaComponent', () => {
  let component: CostPriceFormulaComponent;
  let fixture: ComponentFixture<CostPriceFormulaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CostPriceFormulaComponent]
    });
    fixture = TestBed.createComponent(CostPriceFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
