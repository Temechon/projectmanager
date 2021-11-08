import { Injectable } from '@angular/core';
import { guid, Project } from '../model/project.model';
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

  removeObject(id: string) {
    this.index.remove(id)
  }

  removeProject(p: Project) {
    for (let rep of p.reports) {
      this.index.remove(rep.id);
    }
    for (let note of p.notes) {
      this.index.remove(note.id);
    }
    for (let act of p.activities) {
      this.index.remove(act.id);
    }
    this.index.remove(p.id);
  }

  updateProject(proj: Project) {

    this.removeProject(proj);

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
    for (let note of proj.notes) {
      this.index.update(note.id,
        {
          id: note.id,
          content: note.content,
          title: "",
          p_id: proj.id,
          p_name: proj.name,
          p_internalid: proj.internalid,
          date: note.date,
          type: "note"
        });
    }
    for (let act of proj.activities) {
      this.index.update(act.id,
        {
          id: act.id,
          content: act.content,
          title: "",
          p_id: proj.id,
          p_name: proj.name,
          p_internalid: proj.internalid,
          date: act.date,
          type: "activity"
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

    // Then add notes
    for (let note of proj.notes) {
      let obj = {
        id: note.id,
        content: note.content,
        title: "",
        p_id: proj.id,
        p_name: proj.name,
        p_internalid: proj.internalid,
        date: note.date,
        type: "note"
      }
      this.index.add(obj)
    }

    // and activities
    for (let act of proj.activities) {
      let obj = {
        id: act.id,
        content: act.content,
        title: "",
        p_id: proj.id,
        p_name: proj.name,
        p_internalid: proj.internalid,
        date: act.date,
        type: "activity"
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

