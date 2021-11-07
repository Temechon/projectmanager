import { Component, OnInit } from '@angular/core';
import { CategoryComponent } from '../../category.component';
import { DateTime } from "luxon";
import { guid } from 'src/app/model/project.model';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent extends CategoryComponent {

  keymap: () => void;

  ngOnInit(): void {
    super.ngOnInit();

    // Add listener on control.n - Does not seem to work on chrome...
    this.keymap = this.renderer.listen('document', 'keydown.control.n', (event) => {
      this.add();
      event.stopPropagation();
      event.preventDefault();
    });
  }

  add() {
    this.project.notes.push({
      id: guid(),
      date: DateTime.local().toFormat('dd LLL yyyy - HH:mm'),
      content: ''
    })
    this.save();
  }

  delete(index: number) {
    this.project.notes.splice(index, 1);
    this.save();
  }

  ngOnDestroy() {
    this.keymap();
  }
}
