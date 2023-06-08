import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeUnitsComponent } from './size-units.component';

describe('SizeUnitsComponent', () => {
  let component: SizeUnitsComponent;
  let fixture: ComponentFixture<SizeUnitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SizeUnitsComponent]
    });
    fixture = TestBed.createComponent(SizeUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
