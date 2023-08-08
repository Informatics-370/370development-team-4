import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomProdComponent } from './custom-prod.component';

describe('CustomProdComponent', () => {
  let component: CustomProdComponent;
  let fixture: ComponentFixture<CustomProdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomProdComponent]
    });
    fixture = TestBed.createComponent(CustomProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
