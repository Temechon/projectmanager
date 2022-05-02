import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../model/project.model';
import { DatabaseService } from '../../services/database.service';
import _ from "underscore";

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
  allProjects: Project[];

  filters: Array<{ label: string, data: Project }> = [];

  filterLabel: string = null;
  displayArchived: boolean = false;

  ngOnInit(): void {
    this.db.getProjects$().subscribe(data => {
      this.allProjects = data;
      // Removede archived projects
      this.projects = this.allProjects.filter(p => p.status !== Project.STATUS.archived);

      this.allProjects.map(p => {
        this.filters.push({ label: p.domain, data: p });
      })
      // Unique values on filters
      this.filters = _.uniq(this.filters, false, (d) => d.label || "");
      this.defaultSort();

    })
  }

  defaultSort() {
    // Sort by status and the sort by domain
    this.projects = _.chain(this.projects).sortBy("domain").sortBy("status").reverse().value();
  }

  save(p: Project) {
    this.db.saveProject(p.toObject());
  }

  toggleArchived() {
    this.displayArchived = !this.displayArchived;
    this._filterByDomain();
  }


  /**
   * Filter task by project
   * @param label 
   */
  toggleFilter(label: string) {

    // If the given label is already selected, remove it
    if (this.filterLabel === label) {
      this.filterLabel = null;
    } else {
      this.filterLabel = label;
    }
    this._filterByDomain();
  }

  private _filterByDomain() {
    this.projects = this.allProjects.slice();

    if (this.filterLabel !== null) {
      this.projects = this.allProjects.filter(t => t.domain === this.filterLabel);
    }

    if (this.displayArchived) {
      // Nothing to do here
    } else {
      this.projects = this.projects.filter(p => p.status !== Project.STATUS.archived);
    }
    this.defaultSort();
  }
}
