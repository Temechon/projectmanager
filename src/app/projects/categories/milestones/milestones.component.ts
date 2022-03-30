import { Component, OnInit } from '@angular/core';
import { getDateFromString, guid, Pin } from 'src/app/model/project.model';
import { CategoryComponent } from '../../category.component';
import { DateTime } from "luxon";

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
      // convert a and b in datetime and sort them
      let date1 = getDateFromString(a.date);
      let date2 = getDateFromString(b.date);
      console.log("diff", date1.diff(date2).toObject().milliseconds);

      return date1.diff(date2).toObject().milliseconds;
    });
    this.save();
  }

  _pin(): Pin {
    return new Pin({
      id: guid(),
      projectid: this.project.id,
      title: 'Jalons',
      projectinternalid: this.project.internalid,
      category: 'milestones',
      params: null
    })
  }

}
