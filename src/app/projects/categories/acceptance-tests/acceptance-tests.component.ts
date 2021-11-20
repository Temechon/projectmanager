import { Component, OnInit } from '@angular/core';
import { CategoryComponent } from '../../category.component';

@Component({
  selector: 'app-acceptance-tests',
  templateUrl: './acceptance-tests.component.html',
  styleUrls: ['./acceptance-tests.component.scss']
})
export class AcceptanceTestsComponent extends CategoryComponent {

  status = [
    {
      label: 'Ouvert',
      data: { color: '#ff3d71' }
    },
    {
      label: 'Corrigé en INT',
      data: { color: '#ffaa00' }
    },
    {
      label: 'Corrigé en RCT',
      data: { color: '#0095ff' }
    },
    {
      label: 'Fermé',
      data: { color: '#37BA83' }
    }
  ]

  add() {
    this.project.incidents.push({
      id: "",
      detail: "",
      comment: "",
      status: this.status[0].label
    });
    this.save();
  }

  delete(index: number) {
    this.project.incidents.splice(index, 1);
    this.save();
  }

  /**
   * Copy all incidents into clipboard
   */
  copyAll() {
    let str = "";
    for (let incident of this.project.incidents) {
      str += `${incident.id} : ${incident.detail} - ${incident.status}`

      if (incident.comment) {
        str += ` (${incident.comment})\n`
      } else {
        str += "\n"
      }
      navigator.clipboard.writeText(str);
    }
  }

}
