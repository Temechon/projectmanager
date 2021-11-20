import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';


@Injectable({
  providedIn: 'root'
})
export class IpcService {

  private _ipc: IpcRenderer | undefined;


  constructor() {
    if (window.require) {
      try {
        this._ipc = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }

  }

  public on(channel: string, listener: any): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.on(channel, listener);
  }

  public once(channel: string, listener: any): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.once(channel, listener);
  }

  public send(channel: string, ...args): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.send(channel, ...args);
  }

  public sendSync(channel: string, ...args): any {
    if (!this._ipc) {
      return;
    }
    return this._ipc.sendSync(channel, ...args);
  }
}
