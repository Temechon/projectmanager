import { Component } from '@angular/core';
import { appWindow } from '@tauri-apps/api/window'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'projectmanager';

  ngOnInit() {
    appWindow.maximize();
  }
}
