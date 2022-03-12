import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  syncStatus = new BehaviorSubject(SyncService.STATUS_SYNCED);
  static STATUS_SYNCING = "syncing";
  static STATUS_SYNCED = "ok";
  static STATUS_ERROR = "error";

  constructor() { }
}
