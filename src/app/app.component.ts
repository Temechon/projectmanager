import { Component } from '@angular/core';
import { IpcService } from './services/ipc.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private ipcService: IpcService) { }

  ngOnInit() {
  }

  // USe ipcservice to minimize the electron window
  minimize() {
    console.log("Minimize window");
    this.ipcService.send('minimize');
  }

  maximize() {
    console.log("Maximize window");
    this.ipcService.send('maximize');
  }

  close() {
    console.log("Close window");
    this.ipcService.send('close');
  }

}
