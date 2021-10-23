import { Component } from '@angular/core';
import _ from 'underscore';
import { CategoryComponent } from '../category.component';

@Component({
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.scss']
})
export class ActorsComponent extends CategoryComponent {

  sortAttribute: string = 'name';
  sortOrder = 1;
  newactor = {
    name: '',
    dga: '',
    comment: ''
  }

  add() {
    if (this.newactor.name || this.newactor.dga) {
      this.project.actors.push({
        name: this.newactor.name,
        dga: this.newactor.dga,
        comment: this.newactor.comment
      });
      this.newactor = _.mapObject(this.newactor, () => "")
      this.save();
    }
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
    this.project.actors.sort((a: { name: string, dga: string }, b: { name: string, dga: string }) => {
      if (this.sortAttribute === 'name') {
        if (!a.name) {
          return -1 * this.sortOrder;
        }
        if (!b.name) {
          return 1 * this.sortOrder;
        }
        return a.name.localeCompare(b.name) * this.sortOrder;
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

}
