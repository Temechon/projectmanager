import { Injectable } from '@angular/core';
import { Document } from 'flexsearch';
import { Project } from '../model/project.model';
import { Task } from '../model/task.model';


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
    for (let act of p.actions) {
      this.index.remove(act.id);
    }
    this.index.remove(p.id);
  }

  updateProject(proj: Project) {

    this.removeProject(proj);

    // Index reports
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

    // Index notes
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

    // Index actions
    for (let action of proj.actions) {
      this.index.update(action.id,
        {
          id: action.id,
          content: action.details + " - " + action.answer,
          title: action.name,
          p_id: proj.id,
          p_name: proj.name,
          p_internalid: proj.internalid,
          date: action.date,
          type: "action"
        });
    }

    // Index project details
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


    // Index actions
    for (let action of proj.actions) {
      let obj =
      {
        id: action.id,
        content: action.details + " - " + action.answer,
        title: action.name,
        p_id: proj.id,
        p_name: proj.name,
        p_internalid: proj.internalid,
        date: action.date,
        type: "action"
      };
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

  /**
   * Add the given task to the index
   * @param task 
   */
  addTask(task: Task) {
    this.index.add({
      id: task.id,
      content: task.content,
      title: task.status, // Task status is the title
      p_id: task.projectid,
      p_name: "",
      p_internalid: task.projectinternalid,
      date: task.date,
      type: "task"
    })
  }

  updateTask(task: Task) {
    this.index.update(task.id, {
      id: task.id,
      content: task.content,
      title: task.status, // Task status is the title
      p_id: task.projectid,
      p_name: "",
      p_internalid: task.projectinternalid,
      date: task.date,
      type: "task"
    })
  }



  async init(p: Project[], tasks: Task[] = []) {

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
    for (let task of tasks) {
      this.addTask(task);
    }
  }
}

