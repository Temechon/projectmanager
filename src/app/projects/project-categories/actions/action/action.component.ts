import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pin } from 'src/app/model/pin.model';
import { Action, ActionStatus, guid, Project } from 'src/app/model/project.model';
import { CategoryComponent } from 'src/app/projects/category.component';
import { DateTime } from "luxon";

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent extends CategoryComponent {


  actionSub: Subscription;
  action: Action;
  actionStatus = ActionStatus;

  ngOnInit(): void {

    super.ngOnInit();

    this.actionSub = this.route.params.subscribe(params => {

      // Get project from parent route snapshot
      this.project = this.route.parent.parent.snapshot.data.project as Project;

      // Get test list id from url
      let actionId = this.route.snapshot.paramMap.get('id');

      // Get test case from project
      this.action = this.project.actions.find(act => act.id === actionId)

    });
  }

  ngOnDestroy() {
    this.actionSub?.unsubscribe();
  }

  get category(): string {
    return 'actions';
  }

  createPin(): Pin {
    return new Pin({
      id: guid(),
      projectid: this.project.id,
      title: this.action.name,
      projectinternalid: this.project.internalid,
      category: this.category,
      params: this.action.id,
    })
  }

  goToActions() {
    this.router.navigate(['/projects', this.project.id, 'actions']);
  }

  /**
   * Close this actions
   */
  closeAction() {
    let res = window.confirm("Êtes-vous sûr de vouloir clôturer cette action ?");
    if (res) {

      this.action.close_date = DateTime.now().toLocaleString(DateTime.DATE_SHORT);
      this.action.status = ActionStatus.CLOSED;

      this.save().then(() => {
        this.toaster.toast({
          type: 'success',
          icon: 'fas fa-check',
          content: "L'action a bien été clôturée !"
        })
        this.goToActions();
      })
    }
  }

  reopenAction() {
    this.action.close_date = '';
    this.action.status = ActionStatus.OPEN;

    this.save().then(() => {
      this.toaster.toast({
        type: 'success',
        icon: 'fas fa-check',
        content: "L'action a été réouverte !"
      })
      this.goToActions();
    })
  }

}
