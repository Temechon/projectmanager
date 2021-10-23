import { Component, ElementRef, ViewChild } from '@angular/core';
import { guid } from 'src/app/model/project.model';
import { CategoryComponent } from '../category.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends CategoryComponent {

  @ViewChild('editorRef') editorRef: ElementRef;

  selected: any;
  selectedindex: number;

  ngAfterViewInit() {
  }

  select(index: number) {
    this.selected = this.project.reports[index];
    this.selectedindex = index;
    console.log("selected", this.selected.id);

  }

  addReport() {
    this.project.reports.push({
      id: guid(),
      title: 'Test titre',
      content: 'Contenu test' + guid(),
      date: "10/20/2020"
    })
    this.save();
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

