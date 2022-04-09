import { Component, OnInit } from '@angular/core';
import { Pin } from 'src/app/model/pin.model';
import { ActionStatus, guid } from 'src/app/model/project.model';
import { CategoryComponent } from '../../category.component';
import { DateTime } from "luxon";

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent extends CategoryComponent {


  actionStatus = ActionStatus;

  ngOnInit(): void {
    super.ngOnInit();

    // Get the project from the parent parent route
    let prr = this.route.parent.parent.snapshot.data;
    this.project = prr.project;
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

  /**
   * Add a test case
   */
  add() {

    let uid = guid();
    this.project.actions.push({
      id: uid,
      name: '',
      from: '',
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
    let res = window.confirm("Êtes-vous sûr de vouloir supprimer cette action ?");
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



}
