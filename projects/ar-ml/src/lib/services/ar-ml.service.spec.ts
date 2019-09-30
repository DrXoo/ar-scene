import { TestBed } from '@angular/core/testing';

import { ArMlService } from './ar-ml.service';

describe('ArMlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArMlService = TestBed.get(ArMlService);
    expect(service).toBeTruthy();
  });
});
