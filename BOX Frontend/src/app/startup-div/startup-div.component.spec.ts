import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupDivComponent } from './startup-div.component';

describe('StartupDivComponent', () => {
  let component: StartupDivComponent;
  let fixture: ComponentFixture<StartupDivComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartupDivComponent]
    });
    fixture = TestBed.createComponent(StartupDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
