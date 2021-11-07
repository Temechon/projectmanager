import { Component, OnInit } from '@angular/core';
import { CategoryComponent } from '../../category.component';
import { DateTime } from "luxon";
import { guid, Note } from 'src/app/model/project.model';
import { Subscription } from 'rxjs';
import _ from 'underscore';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent extends CategoryComponent {

  selected: Note;
  selectedIndex: number;
  keymap: () => void;
  sub: Subscription;

  ngOnInit(): void {
    super.ngOnInit();

    // Add listener on control.n - Does not seem to work on chrome...
    this.keymap = this.renderer.listen('document', 'keydown.control.n', (event) => {
      this.add();
      event.stopPropagation();
      event.preventDefault();
    });

    this.sub = this.route.queryParams.subscribe((data) => {
      let noteid = data.id;
      if (noteid) {
        // Select this note
        this.selected = _.find(this.project.notes, n => n.id === noteid);
        this.selectedIndex = _.indexOf(this.project.notes, this.selected);
      }
    })

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
    // remove selected if this was the selected note
    if (this.selectedIndex === index) {
      this.selected = null;
      this.selectedIndex = null;
    }
    this.save();
  }

  ngOnDestroy() {
    this.keymap();
    this.sub.unsubscribe();
  }
}
