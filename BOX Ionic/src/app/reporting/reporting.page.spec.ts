import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportingPage } from './reporting.page';

describe('ReportingPage', () => {
  let component: ReportingPage;
  let fixture: ComponentFixture<ReportingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReportingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
