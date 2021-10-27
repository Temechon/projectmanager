import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';
import { Project } from '../model/project.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  fuse: Fuse<Project>;

  constructor() {

  }

  search(term: string): Fuse.FuseResult<any>[] {
    return this.fuse.search(term);
  }
  removeProject(p: Project) {
    let removed = this.fuse.remove((doc: Project, index: number) => doc.id === p.id);
    console.log("Project removed", removed);
  }

  updateProject(p: Project) {
    this.removeProject(p)
    // Add the new one
    this.fuse.add(p);
  }

  async init(p: Project[]) {

    console.log("INDEX INIT --> all project from search service", p)
    this.fuse = new Fuse(p, {
      includeMatches: true,
      includeScore: true,
      threshold: 0.4,
      keys: [
        "internalid",
        "name",
        "description",

        "actors.name",
        "actors.dga",
        "actors.comment",

        "reports.content",
        "reports.title"
      ]
    })
  }
}

