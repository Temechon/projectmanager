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

  selected: boolean;
  selectedindex: number;

  ngOnInit() {
    super.ngOnInit();
    let url = this.route.snapshot.routeConfig.children?.length
    if (url > 0) {
      this.selected = true;
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

