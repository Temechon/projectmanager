import { Injectable } from '@angular/core';
import { Project } from '../model/project.model';
import { Document } from 'flexsearch';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  index: Document<any, string[]>;

  constructor() {

  }

  search(term: string): any[] {
    return this.index.search(term, { enrich: true })
  }

  removeProject(p: Project) {
    for (let rep of p.reports) {
      this.index.remove(rep.id);
    }
    this.index.remove(p.id);
  }

  updateProject(proj: Project) {
    for (let report of proj.reports) {
      this.index.update(report.id,
        {
          id: report.id,
          content: report.content,
          title: report.title,
          p_id: proj.id,
          p_name: proj.name,
          p_internalid: proj.internalid,
          date: report.date,
          type: "report"
        });
    }
    this.index.update(proj.id, {
      id: proj.id,
      content: proj.description,
      title: proj.internalid + " - " + proj.name,
      p_id: proj.id,
      p_name: proj.name,
      p_internalid: proj.internalid,
      type: "project"
    });
    // // Add the new one
    // this.fuse.add(p);
  }

  addProject(proj: Project) {
    // First add reports
    for (let report of proj.reports) {
      let obj = {
        id: report.id,
        content: report.content,
        title: report.title,
        p_id: proj.id,
        p_name: proj.name,
        p_internalid: proj.internalid,
        date: report.date,
        type: "report"
      }
      this.index.add(obj)
    }

    // Add project
    let obj = {
      id: proj.id,
      content: proj.description,
      title: proj.internalid + " - " + proj.name,
      p_id: proj.id,
      p_name: proj.name,
      p_internalid: proj.internalid,
      type: "project"
    }
    this.index.add(obj)
  }

  async init(p: Project[]) {

    console.log("INDEX INIT --> all project from search service", p)

    this.index = new Document<string, string[]>({
      document: {
        id: "id",
        index: [
          {
            field: "content", // or project description
            tokenize: "forward"
          },
          {
            field: "title", // or project name
            tokenize: "forward"
          }
        ],
        store: ["type", "title", "content", "date", "p_id", "p_internalid", "p_name"]
      }
    });

    for (let proj of p) {
      this.addProject(proj)
    }
  }
}

