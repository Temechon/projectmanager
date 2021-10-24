import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  fuse: Fuse<any>;

  constructor(d: DatabaseService) {

    d.getProjects().then((p) => {
      console.log("all project from search service", p)
      this.fuse = new Fuse(p, {
        includeMatches: true,
        includeScore: true,
        threshold: 0.5,
        keys: [
          "name",
          "description",
          "actors.name",
          "actors.dga",
          "actors.comment",
          "reports.content",
          "reports.title"
        ]
      })
    })

  }

  search(term: string) {
    console.log("Searching here", this.fuse.search(term));

  }
}
