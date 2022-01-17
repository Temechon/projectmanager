import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../model/project.model';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss']
})
export class ProjectlistComponent implements OnInit {

  constructor(
    private db: DatabaseService,
    private router: Router) { }

  projects: Project[];


  status = [
    {
      label: 'En cours',
      data: { color: '#37BA83' }
    },
    {
      label: 'En attente',
      data: { color: '#ffaa00' }
    },
    {
      label: 'Archivé',
      data: { color: '#0095ff' }
    }
  ]

  ngOnInit(): void {
    this.db.getProjects$().subscribe(data => {
      this.projects = data;

    })
  }

  save(p: Project) {
    this.db.saveProject(p.toObject());
  }

}
