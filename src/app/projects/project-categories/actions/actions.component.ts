import { Component, OnInit } from '@angular/core';
import { Pin } from 'src/app/model/pin.model';
import { Action, ActionStatus, guid } from 'src/app/model/project.model';
import { CategoryComponent } from '../../category.component';
import { DateTime } from "luxon";

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent extends CategoryComponent {


  actionStatus = ActionStatus;
  displayClosed: boolean = false;

  allActions: Array<Action> = [];

  ngOnInit(): void {
    super.ngOnInit();

    // Get the project from the parent parent route
    let prr = this.route.parent.parent.snapshot.data;
    this.project = prr.project;

    this._filter();
  }

  get category(): string {
    return 'actions';
  }

  createPin(): Pin {
    return new Pin({
      id: guid(),
      projectid: this.project.id,
      title: 'Actions',
      projectinternalid: this.project.internalid,
      category: this.category,
      params: null
    })
  }

  private _filter() {
    this.allActions = this.project.actions.filter(a => {
      if (this.displayClosed) {
        return true;
      }
      return a.status !== ActionStatus.CLOSED;
    })
  }

  /**
   * Add a test case
   */
  add() {

    let uid = guid();
    this.project.actions.push({
      id: uid,
      name: '',
      from: '',
      waitingfor: '',
      date: DateTime.now().toLocaleString(DateTime.DATE_SHORT),
      status: ActionStatus.OPEN,
      details: '',
      answer: '',
      close_date: '',
      comments: []
    })
    this.save().then(() => {
      this.router.navigate(['/projects', this.project.id, 'actions', uid]);
    })
  }

  delete(index: number, $event: any) {
    $event.stopPropagation();
    let res = this.confirmService.confirm('Êtes vous sûr de vouloir supprimer cette action ?', "Supprimer l'action");
    if (res) {
      this.project.actions.splice(index, 1);
      this.toaster.toast({
        type: 'success',
        icon: 'fas fa-check',
        content: "L'action a bien été supprimée !"
      })
      this.save();
    }
  }

  toggleClosed() {
    this.displayClosed = !this.displayClosed;
    this._filter();
  }



}
