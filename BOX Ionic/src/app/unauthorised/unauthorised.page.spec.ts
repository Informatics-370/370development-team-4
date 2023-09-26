import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnauthorisedPage } from './unauthorised.page';

describe('UnauthorisedPage', () => {
  let component: UnauthorisedPage;
  let fixture: ComponentFixture<UnauthorisedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UnauthorisedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
