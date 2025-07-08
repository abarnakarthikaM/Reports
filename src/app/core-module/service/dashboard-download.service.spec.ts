import { TestBed } from '@angular/core/testing';

import { DashboardDownloadService } from './dashboard-download.service';

describe('DashboardDownloadService', () => {
  let service: DashboardDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
