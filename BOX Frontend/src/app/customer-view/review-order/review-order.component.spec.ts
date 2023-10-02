import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewOrderComponent } from './review-order.component';

describe('ReviewOrderComponent', () => {
  let component: ReviewOrderComponent;
  let fixture: ComponentFixture<ReviewOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewOrderComponent]
    });
    fixture = TestBed.createComponent(ReviewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
