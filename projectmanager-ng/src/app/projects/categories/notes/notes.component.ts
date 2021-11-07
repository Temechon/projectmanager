import { Component, OnInit } from '@angular/core';
import { CategoryComponent } from '../../category.component';
import { DateTime } from "luxon";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent extends CategoryComponent {


  add() {
    this.project.notes.push({
      date: DateTime.local().toFormat('dd LLL yyyy - HH:mm'),
      content: ''
    })
    this.save();
  }

  delete(index: number) {
    this.project.notes.splice(index, 1);
    this.save();
  }
}
