import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateDurationComponent } from './estimate-duration.component';

describe('EstimateDurationComponent', () => {
  let component: EstimateDurationComponent;
  let fixture: ComponentFixture<EstimateDurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstimateDurationComponent]
    });
    fixture = TestBed.createComponent(EstimateDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
