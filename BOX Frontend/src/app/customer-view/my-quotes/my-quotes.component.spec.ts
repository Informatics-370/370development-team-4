import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuotesComponent } from './my-quotes.component';

describe('MyQuotesComponent', () => {
  let component: MyQuotesComponent;
  let fixture: ComponentFixture<MyQuotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyQuotesComponent]
    });
    fixture = TestBed.createComponent(MyQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
