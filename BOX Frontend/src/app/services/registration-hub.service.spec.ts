import { TestBed } from '@angular/core/testing';

import { RegistrationHubService } from './registration-hub.service';

describe('RegistrationHubService', () => {
  let service: RegistrationHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
