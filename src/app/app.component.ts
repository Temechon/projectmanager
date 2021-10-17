import { Component } from '@angular/core';
import { DatabaseLokiService } from './services/database-loki.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private db: DatabaseLokiService) { }

  ngOnInit() {
  }
}
