import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateLineComponent } from './estimate-line.component';

describe('EstimateLineComponent', () => {
  let component: EstimateLineComponent;
  let fixture: ComponentFixture<EstimateLineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstimateLineComponent]
    });
    fixture = TestBed.createComponent(EstimateLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
