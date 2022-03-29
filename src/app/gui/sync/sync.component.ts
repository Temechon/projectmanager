import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { SyncService } from 'src/app/services/sync.service';

@Component({
  selector: 'sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss']
})
export class SyncComponent implements OnInit {

  constructor(private syncService: SyncService) { }

  isSynced: string;
  status_ok = SyncService.STATUS_SYNCED;
  status_error = SyncService.STATUS_ERROR;
  status_syncing = SyncService.STATUS_SYNCING;

  ngOnInit(): void {
    this.syncService.syncStatus.subscribe(status => {
      this.isSynced = status
    });
  }

}
