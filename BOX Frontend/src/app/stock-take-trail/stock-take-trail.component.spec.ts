import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTakeTrailComponent } from './stock-take-trail.component';

describe('StockTakeTrailComponent', () => {
  let component: StockTakeTrailComponent;
  let fixture: ComponentFixture<StockTakeTrailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockTakeTrailComponent]
    });
    fixture = TestBed.createComponent(StockTakeTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
