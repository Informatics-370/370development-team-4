import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteOffReasonComponent } from './write-off-reason.component';

describe('WriteOffReasonComponent', () => {
  let component: WriteOffReasonComponent;
  let fixture: ComponentFixture<WriteOffReasonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WriteOffReasonComponent]
    });
    fixture = TestBed.createComponent(WriteOffReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
