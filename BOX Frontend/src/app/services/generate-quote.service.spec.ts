import { TestBed } from '@angular/core/testing';

import { GenerateQuoteService } from './generate-quote.service';

describe('GenerateQuoteService', () => {
  let service: GenerateQuoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateQuoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
