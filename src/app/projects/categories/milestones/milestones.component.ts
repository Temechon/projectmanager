import { Component, OnInit } from '@angular/core';
import { guid } from 'src/app/model/project.model';
import { CategoryComponent } from '../../category.component';

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.scss']
})
export class MilestonesComponent extends CategoryComponent {


  add() {
    this.project.milestones.push({
      id: guid(),
      name: "",
      date: ""
    });
    this.save();
  }

  delete(index: number) {
    this.project.milestones.splice(index, 1);
    this.save();
  }

  orderAndSave() {
    this.project.milestones.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    this.save();
  }

}
