import { Component } from '@angular/core';
import { DateTime } from "luxon";
import { Subscription } from 'rxjs';
import { Pin } from 'src/app/model/pin.model';
import { guid } from 'src/app/model/project.model';
import { CategoryComponent } from '../../category.component';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends CategoryComponent {

  selected: boolean;

  reportRouteSub: Subscription;
  urlSub: Subscription;


  ngOnInit() {
    super.ngOnInit();

    this.urlSub = this.route.url.subscribe(res => {

      console.log("init reports", this.route.snapshot.data);

      // If no report has been selected, forward to the last one
      let url = this.router.url.split('/').pop().trim();
      if (url !== "reports") {
        this.selected = true;

        this.reportRouteSub?.unsubscribe();
        this.reportRouteSub = this.route.firstChild.data.subscribe(d => {
          let report = d.report;
          console.log("report changed");
          if (report) {
            this.pinner.setPinned(this.project.id, this.category, report.id);
          }
        })
      } else {
        // forward to the last report if any
        this.selected = false;
        if (this.project.reports.length > 0) {
          console.log("go to next report");
          this.goToReport(this.project.reports[this.project.reports.length - 1].id);
        }
      }

    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.reportRouteSub?.unsubscribe();
    this.urlSub?.unsubscribe();
  }

  get category(): string {
    return 'reports';
  }

  goToReport(reportid: string) {
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

  createPin(): Pin {
    // Get the current report
    let report = this.project.reports.find(report => report.id === this.router.url.split('/').pop().trim());
    return new Pin({
      id: guid(),
      projectid: this.project.id,
      title: report.title,
      projectinternalid: this.project.internalid,
      category: this.category,
      params: report.id
    })
  }
}

