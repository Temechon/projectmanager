import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project, TEST_PROJECT } from 'src/app/model/project.model';
import { DatabaseLokiService } from 'src/app/services/database-loki.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor(private db: DatabaseLokiService, private router: Router) { }

  projects;

  async ngOnInit() {

    this.projects = await this.db.getProjects();
    if (this.projects.total_rows === 0) {
      this.db.addProject(TEST_PROJECT())
      this.projects = this.db.getProjects();
    }

    this.router.navigate(['projects', this.projects[0].id])
  }

}
