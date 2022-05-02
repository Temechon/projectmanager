import { Component, QueryList, ViewChildren } from '@angular/core';
import { DateTime } from "luxon";
import { Subscription } from 'rxjs';
import { EditableAreaComponent } from 'src/app/gui/editable-area/editable-area.component';
import { Pin } from 'src/app/model/pin.model';
import { guid, Note } from 'src/app/model/project.model';
import _ from 'underscore';
import { CategoryComponent } from '../../category.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent extends CategoryComponent {

  selected: Note = null;
  selectedIndex: number = null;
  sub: Subscription;

  @ViewChildren(EditableAreaComponent) editableAreas: QueryList<EditableAreaComponent>;

  ngOnInit(): void {
    super.ngOnInit();

    this.project.notes = _.chain(this.project.notes).sortBy('date').sortBy('pinned').value();

    this.sub = this.route.queryParams.subscribe((data) => {
      let noteid = data.id;
      if (noteid) {
        // Select this note
        this.selected = _.find(this.project.notes, n => n.id === noteid);
        this.selectedIndex = _.indexOf(this.project.notes, this.selected);
      }
    })

  }


  get category(): string {
    return 'notes';
  }

  ngAfterViewInit() {
    // console.log(this.editableAreas);
    if (this.selectedIndex !== null) {
      this._focus(this.selectedIndex);
    }

    // When the list is updated, focus the new one
    this.editableAreas.changes.subscribe((r) => {
      console.log("changes", r);
      this._focus(this.project.notes.length - 1);
    });
  }

  _focus(index: number) {
    if (index < 0 || index >= this.editableAreas.length) {
      return
    }
    let area = this.editableAreas.get(index);
    area.focus();
  }

  add() {
    this.project.notes.push({
      id: guid(),
      date: DateTime.local().toFormat('dd LLL yyyy - HH:mm'),
      content: '',
      pinned: false
    });
    this.project.notes = _.chain(this.project.notes).sortBy('date').sortBy('pinned').value();
    this.save();
  }

  delete(index: number) {
    let notes = this.project.notes.splice(index, 1);
    // remove selected if this was the selected note
    if (this.selectedIndex === index) {
      this.selected = null;
      this.selectedIndex = null;
    }
    this.save();
    this.index.removeObject(notes[0].id)
  }


  togglePin(note: Note) {
    note.pinned = !note.pinned;
    this.project.notes = _.chain(this.project.notes).sortBy('date').sortBy('pinned').value();

    this.save();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  createPin(): Pin {

    return new Pin({
      id: guid(),
      projectid: this.project.id,
      title: 'Notes',
      projectinternalid: this.project.internalid,
      category: this.category,
      params: null
    })
  }
}
