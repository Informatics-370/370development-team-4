import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QouteRequestsComponent } from './qoute-requests.component';

describe('QouteRequestsComponent', () => {
  let component: QouteRequestsComponent;
  let fixture: ComponentFixture<QouteRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QouteRequestsComponent]
    });
    fixture = TestBed.createComponent(QouteRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
