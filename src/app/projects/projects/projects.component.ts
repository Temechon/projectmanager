import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { IProject, Project, TEST_PROJECT } from 'src/app/model/project.model';
import { DatabaseLokiService } from 'src/app/services/database-loki.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor(private db: DatabaseLokiService, private router: Router) { }

  projects: Project[];

  ngOnInit() {

    this.db.getProjects$().subscribe(data => {
      this.projects = data;
    })

  }

  addProject() {
    this.db.saveProject(new Project()).then(d => {
      console.log("Project créé!", d);

      this.router.navigate(['projects', d.id])
    })
  }

}
