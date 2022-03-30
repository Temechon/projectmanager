import { Component } from '@angular/core';
import { DateTime } from "luxon";
import { guid, Pin } from 'src/app/model/project.model';
import { CategoryComponent } from '../../category.component';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends CategoryComponent {

  selected: boolean;

  ngOnInit() {
    super.ngOnInit();
    let url = this.router.url.split('/').pop().trim();
    if (url !== "reports") {
      this.selected = true;
    } else {
      // forward to the last report if any
      this.selected = false;
      if (this.project.reports.length > 0) {
        this.goToReport(this.project.reports[this.project.reports.length - 1].id);
      }

    }

  }
  goToReport(reportid: string) {
    this.selected = true;
    this.router.navigate(['projects', this.project.id, 'reports', reportid]);

  }

  addReport() {
    let note = {
      id: guid(),
      title: 'Titre',
      content: '',
      date: DateTime.now().toLocaleString(DateTime.DATE_SHORT)
    };
    this.project.reports.push(note);
    this.save().then(() => {
      this.goToReport(note.id)
    });
  }

  _pin(): Pin {
    // Get the current report
    let report = this.project.reports.find(report => report.id === this.router.url.split('/').pop().trim());
    return new Pin({
      id: guid(),
      projectid: this.project.id,
      title: report.title,
      projectinternalid: this.project.internalid,
      category: 'reports',
      params: report.id
    })
  }
}

