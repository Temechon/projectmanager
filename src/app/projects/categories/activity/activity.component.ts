import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { EditableAreaComponent } from 'src/app/gui/editable-area/editable-area.component';
import { guid, Activity } from 'src/app/model/project.model';
import _ from 'underscore';
import { CategoryComponent } from '../../category.component';
import { DateTime } from "luxon";

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent extends CategoryComponent {

  selected: Activity = null;
  selectedIndex: number = null;
  keymap: () => void;
  sub: Subscription;

  @ViewChildren(EditableAreaComponent) editableAreas: QueryList<EditableAreaComponent>;

  ngOnInit(): void {
    super.ngOnInit();

    // Add listener on control.n - Does not seem to work on chrome...
    this.keymap = this.renderer.listen('document', 'keydown.control.n', (event) => {
      this.add();
      event.stopPropagation();
      event.preventDefault();
    });

    this.sub = this.route.queryParams.subscribe((data) => {
      let activityid = data.id;
      if (activityid) {
        // Select this note
        this.selected = _.find(this.project.activities, n => n.id === activityid);
        this.selectedIndex = _.indexOf(this.project.activities, this.selected);
      }
    })

  }
  ngAfterViewInit() {
    console.log(this.editableAreas);
    if (this.selectedIndex !== null) {
      this._focus(this.selectedIndex);
    }

    // When the list is updated, focus the new one
    this.editableAreas.changes.subscribe((r) => {
      console.log("changes", r);
      this._focus(this.project.activities.length - 1);
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
    this.project.activities.push({
      id: guid(),
      date: DateTime.local().toFormat('dd LLL yyyy - HH:mm'),
      content: '',
      status: ''
    });
    this.save();
  }

  delete(index: number) {
    let activity = this.project.activities.splice(index, 1);
    // remove selected if this was the selected note
    if (this.selectedIndex === index) {
      this.selected = null;
      this.selectedIndex = null;
    }
    this.save();
    this.index.removeObject(activity[0].id)
  }

  ngOnDestroy() {
    this.keymap();
    this.sub.unsubscribe();
  }
}