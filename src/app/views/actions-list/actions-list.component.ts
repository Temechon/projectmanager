import { Component, OnInit } from '@angular/core';
import { Action, ActionStatus, Project } from 'src/app/model/project.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-actions-list',
  templateUrl: './actions-list.component.html',
  styleUrls: ['./actions-list.component.scss']
})
export class ActionsListComponent implements OnInit {

  allActions: Array<{
    color: string,
    projectinternalid: string,
    projectid: string,
    action: Action
  }> = [];

  allProjects: Array<Project> = [];

  constructor(
    private db: DatabaseService,
  ) { }

  ngOnInit(): void {

    this.db.getProjects$().subscribe(data => {

      this.allProjects = data;
      // Removede archived projects
      this.allProjects = this.allProjects.filter(p => p.status !== Project.STATUS.archived);

      this.allProjects.map(p => {
        // for each actions, get only actions not resolved
        let openActions = p.actions.filter(a => a.status !== ActionStatus.CLOSED);
        for (let action of openActions) {
          this.allActions.push({
            color: p.color,
            projectinternalid: p.internalid,
            projectid: p.id,
            action: action
          });
        }
      })
    })
  }

}
