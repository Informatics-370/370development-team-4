import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WriteOffPage } from './write-off.page';

describe('WriteOffPage', () => {
  let component: WriteOffPage;
  let fixture: ComponentFixture<WriteOffPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WriteOffPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
