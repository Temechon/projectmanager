import { Component } from '@angular/core';
import { DatabaseService } from './services/database.service';
import { IpcService } from './services/ipc.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() { }

  ngOnInit() {
  }

}
