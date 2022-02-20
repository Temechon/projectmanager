import { Component } from '@angular/core';
import { DateTime } from "luxon";
import { Subscription } from 'rxjs';
import { guid, Report } from 'src/app/model/project.model';
import _ from 'underscore';
import { CategoryComponent } from '../../category.component';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends CategoryComponent {

  selected: any;
  selectedindex: number;
  sub: Subscription;

  ngOnInit() {
    super.ngOnInit();

    this.sub = this.route.queryParams.subscribe((data) => {
      let reportid = data.id;
      if (reportid) {
        // Select this report
        this.selected = _.find(this.project.reports, p => p.id === reportid);
        this.selectedindex = _.indexOf(this.project.reports, this.selected);
      } else {
        if (this.project.reports.length > 0) {
          this.selected = _.last(this.project.reports)
          this.selectedindex = this.project.reports.length - 1
        }
      }
    })

  }

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
  }

  deleteReport(index: number) {
    this.selected = null;
    this.selectedindex = -1;
    let reports = this.project.reports.splice(index, 1);

    this.selected = _.last(this.project.reports)
    this.selectedindex = this.project.reports.length - 1
    this.save();

    this.index.removeObject(reports[0].id);
  }

  updateReport($event: Partial<Report>) {
    for (let key in $event) {
      this.select[key] = $event[key];
    }
    this.save();
  }

  isSelected(pid: string) {
    return this.selected?.id === pid;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fullscreen(div: HTMLDivElement) {
    div.classList.toggle("w-[calc(100%-15rem)]")
    div.classList.toggle("pl-8")
    div.classList.toggle("absolute")
    div.classList.toggle("left-5");
    div.classList.toggle("right-5");
    div.classList.toggle("top-5");
    div.classList.toggle("bottom-5");
  }
}

