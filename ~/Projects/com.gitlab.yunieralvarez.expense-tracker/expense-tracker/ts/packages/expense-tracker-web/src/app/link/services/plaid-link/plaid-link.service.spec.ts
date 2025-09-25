import { TestBed } from '@angular/core/testing';

import { PlaidLinkService } from './plaid-link.service';

describe('PlaidLinkService', () => {
  let service: PlaidLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaidLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
