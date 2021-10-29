import { Injectable } from '@angular/core';
import { Project } from '../model/project.model';
import { Document } from 'flexsearch';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  reportsIndex: Document<any, string[]>;

  constructor() {

  }

  search(term: string): any[] {
    return this.reportsIndex.search(term, { enrich: true })
  }

  removeProject(p: Project) {
    for (let rep of p.reports) {
      this.reportsIndex.remove(rep.id);
    }
    this.reportsIndex.remove(p.id);
    // let removed = this.fuse.remove((doc: Project, index: number) => doc.id === p.id);
    // console.log("Project removed", removed);
  }

  updateProject(proj: Project) {
    for (let report of proj.reports) {
      this.reportsIndex.update(report.id,
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
    this.reportsIndex.update(proj.id, {
      id: proj.id,
      content: proj.description,
      title: proj.name,
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
      this.reportsIndex.add(obj)
    }

    // Add project
    let obj = {
      id: proj.id,
      content: proj.description,
      title: proj.name,
      p_id: proj.id,
      p_name: proj.name,
      p_internalid: proj.internalid,
      type: "project"
    }
    this.reportsIndex.add(obj)
  }

  async init(p: Project[]) {

    console.log("INDEX INIT --> all project from search service", p)

    this.reportsIndex = new Document<string, string[]>({
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

    // console.log("results à l'init", this.projectsIndex.search("cartma", { enrich: true }));
    // console.log("results à l'init", this.reportsIndex.search("cartma", { enrich: true }));

    // this.fuse = new Fuse(p, {
    //   includeMatches: true,
    //   includeScore: true,
    //   threshold: 0.5,
    //   keys: [
    //     "internalid",
    //     "name",
    //     "description",

    //     "actors.name",
    //     "actors.dga",
    //     "actors.comment",

    //     "reports.content",
    //     "reports.title"
    //   ]
    // })

  }
}

