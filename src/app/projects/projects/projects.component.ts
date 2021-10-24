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

    // let path = url.substr(_.lastIndexOf(url, '/') + 1, url.length);

    this.db.getProjects$().subscribe(data => {
      this.projects = data;

      let url = this.router.url;
      if (url === "/projects" && this.projects.length > 0) {
        this.router.navigate(['projects', this.projects[0].id])
      }
    })

  }

  addProject() {
    this.db.saveProject(new Project()).then(d => {
      console.log("Project créé!", d);

      this.router.navigate(['projects', d.id])
    })
  }

}
