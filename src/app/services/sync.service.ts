import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  isSaving = new BehaviorSubject(false);
  isOk = new BehaviorSubject(false);

  constructor() { }
}
