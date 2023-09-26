import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WriteOffReasonsPage } from './write-off-reasons.page';

describe('WriteOffReasonsPage', () => {
  let component: WriteOffReasonsPage;
  let fixture: ComponentFixture<WriteOffReasonsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WriteOffReasonsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
