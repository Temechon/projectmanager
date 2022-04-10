import { Component } from '@angular/core';
import { Pin } from 'src/app/model/pin.model';
import { getDateFromString, guid } from 'src/app/model/project.model';
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

  get category(): string {
    return 'milestones';
  }

  orderAndSave() {
    this.project.milestones.sort((a, b) => {
      // convert a and b in datetime and sort them
      let date1 = getDateFromString(a.date);
      let date2 = getDateFromString(b.date);
      // If date1 is null, return date2
      if (!date1) {
        return 1;
      }
      if (!date2) {
        return -1
      }

      console.log("diff", date1.diff(date2).toObject().milliseconds);

      return date1.diff(date2).toObject().milliseconds;
    });
    this.save();
  }

  createPin(): Pin {
    return new Pin({
      id: guid(),
      projectid: this.project.id,
      title: 'Jalons',
      projectinternalid: this.project.internalid,
      category: this.category,
      params: null
    })
  }

}
