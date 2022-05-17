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

  allNotes: Note[];

  @ViewChildren(EditableAreaComponent) editableAreas: QueryList<EditableAreaComponent>;

  ngOnInit(): void {
    super.ngOnInit();

    this.sortNotes();

    this.sub = this.route.queryParams.subscribe((data) => {
      let noteid = data.id;
      if (noteid) {
        // Select this note
        this.selected = _.find(this.allNotes, n => n.id === noteid);
        this.selectedIndex = _.indexOf(this.allNotes, this.selected);
      }
    })
  }

  private sortNotes() {
    let pinned = this.project.notes.filter(n => n.pinned);
    let unpinned = this.project.notes.filter(n => !n.pinned);

    // Sort pinned by date
    this.allNotes = [...this.sortByDate(unpinned), ...this.sortByDate(pinned)]
  }

  /**
   * Sort the given array by date descending
   */
  private sortByDate(notes: Array<Note>) {
    return notes.sort((a: Note, b: Note) => {
      // get the date of the first note
      let dateA = DateTime.fromFormat(a.date, "dd LLL yyyy - HH:mm");
      let dateB = DateTime.fromFormat(b.date, "dd LLL yyyy - HH:mm");
      return dateA.toMillis() - dateB.toMillis()
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
    this.sortNotes();
    this.save();
  }

  delete(noteid: string) {
    let index = _.findIndex(this.project.notes, n => n.id === noteid);
    // remove selected if this was the selected note
    if (this.selected?.id === noteid) {
      this.selected = null;
      this.selectedIndex = null;
    }
    this.project.notes.splice(index, 1);
    this.save();
    this.sortNotes();
    this.index.removeObject(noteid)
  }


  togglePin(note: Note) {
    note.pinned = !note.pinned;
    this.sortNotes();

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
