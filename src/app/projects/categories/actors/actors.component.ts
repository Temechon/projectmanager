import { Component } from '@angular/core';
import { guid, Pin } from 'src/app/model/project.model';
import _ from 'underscore';
import { CategoryComponent } from '../../category.component';

@Component({
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.scss']
})
export class ActorsComponent extends CategoryComponent {

  sortAttribute: string = 'name';
  sortOrder = 1;

  actorsType = [
    {
      label: "Matmut",
      data: { color: '#3366FF' }
    },
    {
      label: "Prestataire",
      data: { color: '#37BA83' }
    },
    {
      label: "Equipe projet",
      data: { color: '#F80A50' }
    }
  ];

  get category(): string {
    return 'actors';
  }

  add() {
    this.project.actors.push({
      name: "",
      dga: "",
      type: "",
      comment: ""
    });
    this.save();
  }

  delete(index: number) {
    this.project.actors.splice(index, 1);
    this.save();
  }

  sortBy(attr: string, caret?: HTMLElement) {
    this.sortAttribute = attr;
    this.sortOrder *= -1;
    if (caret) {
      caret.classList.toggle('rotate-180')
    }
    this.sort();
  }

  sort() {
    this.project.actors.sort((a, b) => {
      if (this.sortAttribute === 'name') {
        if (!a.name) {
          return -1 * this.sortOrder;
        }
        if (!b.name) {
          return 1 * this.sortOrder;
        }
        return a.name.localeCompare(b.name) * this.sortOrder;
      }
      if (this.sortAttribute === 'type') {
        if (!a.type) {
          return -1 * this.sortOrder;
        }
        if (!b.type) {
          return 1 * this.sortOrder;
        }
        return a.type.localeCompare(b.type) * this.sortOrder;
      }
      if (this.sortAttribute === 'dga') {
        if (!a.dga) {
          return -1 * this.sortOrder;
        }
        if (!b.dga) {
          return 1 * this.sortOrder;
        }
        return a.dga.localeCompare(b.dga) * this.sortOrder;
      }
      return a.name.localeCompare(b.name);
    })
  }

  /**
   * Copy all actors names into clipboard
   */
  copyAll() {
    let str = "";
    for (let actor of this.project.actors) {
      str += `${actor.name};`
    }
    navigator.clipboard.writeText(str).then(() => {
      console.log("Written into clipbaord!");

    })
  }

  setTypeToActor(t, $event) {
    console.log(t, $event);

  }

  createPin(): Pin {
    return new Pin({
      id: guid(),
      projectid: this.project.id,
      title: 'Acteurs',
      projectinternalid: this.project.internalid,
      category: this.category,
      params: null
    })
  }

}
