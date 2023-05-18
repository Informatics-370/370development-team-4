import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHelpInventoryComponent } from './view-help-inventory.component';

describe('ViewHelpInventoryComponent', () => {
  let component: ViewHelpInventoryComponent;
  let fixture: ComponentFixture<ViewHelpInventoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewHelpInventoryComponent]
    });
    fixture = TestBed.createComponent(ViewHelpInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
