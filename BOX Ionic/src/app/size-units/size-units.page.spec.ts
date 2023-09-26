import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SizeUnitsPage } from './size-units.page';

describe('SizeUnitsPage', () => {
  let component: SizeUnitsPage;
  let fixture: ComponentFixture<SizeUnitsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SizeUnitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
