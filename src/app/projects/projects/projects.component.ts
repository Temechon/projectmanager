import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doc } from '@lokidb/indexed-storage/types/common/types';
import { guid, Project } from 'src/app/model/project.model';
import { DatabaseLokiService } from 'src/app/services/database-loki.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor(private db: DatabaseLokiService, private router: Router) { }

  projects: Array<Doc<Project>> = [];

  ngOnInit(): void {

    this.projects = this.db.getProjects();
    if (this.projects.length === 0) {
      this.db.addProject({
        id: guid(),
        internalid: "1734",
        name: 'Affichage mode connecté'
      })
      this.projects = this.db.getProjects();
    }

    this.router.navigate(['projects', this.projects[0].id])
  }

}
