import { Component } from '@angular/core';
import { addPouchPlugin, createRxDatabase, dbCount, getRxStoragePouch } from 'rxdb';
import { DatabaseService } from './services/database.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private db: DatabaseService) { }

  ngOnInit() {
    this.db.addProject({});

    this.db.find().then((data: any) => console.log("jch", data));


  }
}
