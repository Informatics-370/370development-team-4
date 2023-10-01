import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RawMaterialsPage } from './raw-materials.page';

describe('RawMaterialsPage', () => {
  let component: RawMaterialsPage;
  let fixture: ComponentFixture<RawMaterialsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RawMaterialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
