import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockTakeTrailPage } from './stock-take-trail.page';

describe('StockTakeTrailPage', () => {
  let component: StockTakeTrailPage;
  let fixture: ComponentFixture<StockTakeTrailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StockTakeTrailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
