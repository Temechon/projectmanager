import { Component } from '@angular/core';
import { DateTime } from "luxon";
import { guid } from 'src/app/model/project.model';
import _ from 'underscore';
import { CategoryComponent } from '../category.component';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends CategoryComponent {

  selected: any;
  selectedindex: number;

  select(index: number) {
    this.selected = this.project.reports[index];
    this.selectedindex = index;
  }

  addReport() {
    let note = {
      id: guid(),
      title: 'Titre',
      content: '',
      date: DateTime.now().toLocaleString(DateTime.DATE_SHORT)
    };
    this.project.reports.push(note)
    this.selected = _.last(this.project.reports)
    this.selectedindex = this.project.reports.length - 1
    this.save();
    // this.selected.title = "jch"
  }

  deleteReport(index: number) {
    this.selected = null;
    this.selectedindex = -1;
    this.project.reports.splice(index, 1);
    this.save();
  }

  isSelected(pid: string) {
    return this.selected?.id === pid;
  }
}

