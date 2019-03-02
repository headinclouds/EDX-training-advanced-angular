import { TestBed, inject } from '@angular/core/testing';

import { GitSearchService} from './git-search-service.service';

describe('GitSearchServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GitSearchService]
    });
  });

  it('should ...', inject([GitSearchService], (service: GitSearchService) => {
    expect(service).toBeTruthy();
  }));
});
