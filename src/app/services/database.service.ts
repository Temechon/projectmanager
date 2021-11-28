import { Injectable } from '@angular/core';
import { addPouchPlugin, createRxDatabase, getRxStoragePouch } from 'rxdb';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProject, Project } from '../model/project.model';
import { ITask, Task } from '../model/task.model';
import { PMCollections, PMDatabase, projectsSchema, taskSchema } from './dbmodel';
import { IpcService } from './ipc.service';
import { SearchService } from './search.service';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() {

  }

  getProject(id: string): Promise<IProject> {
    return projectsCollection.projects.findOne({
      selector: {
        id: id
      }
    }).exec().then(data => {
      // console.log("get project", new Project(data).toObject());

      return new Project(data)
    });
    // return DB_INSTANCE.getCollection('projects').findOne({ id } as any) as Doc<Project>;
  }

  getProjects$(): Observable<Project[]> {
    // return projectsCollection.projects.find().exec().then(datarr => datarr.map(data => new Project(data)));
    return projectsCollection.projects.find().$.pipe(map(datarr => datarr.map(data => new Project(data))));
    // return DB_INSTANCE.allDocs();
    // return DB_INSTANCE.getCollection('projects').find() as Doc<Project>[];
  }

  getTasks$(): Observable<Task[]> {
    return projectsCollection.tasks.find().$.pipe(map(datarr => datarr.map(data => new Task(data))));
  }

  getProjects(): Promise<Project[]> {
    return projectsCollection.projects.find().exec().then(datarr => datarr.map(data => new Project(data)));
  }


  deleteProject(project: Project): Promise<any> {
    return projectsCollection.projects.findOne({
      selector: {
        id: project.id
      }
    }).remove()
  }

  deleteTask(taskid: string): Promise<any> {
    return projectsCollection.tasks.findOne({
      selector: {
        id: taskid
      }
    }).remove()
  }

  saveProject(p: IProject) {
    return projectsCollection.projects.atomicUpsert(p);
  }

  saveTask(t: ITask) {
    return projectsCollection.tasks.atomicUpsert(t);
  }

}

let projectsCollection: PMCollections;
let initState: null | Promise<any> = null;

async function _create() {


  addPouchPlugin(require('pouchdb-adapter-indexeddb'));

  let db = await createRxDatabase<PMDatabase>({
    name: 'projectmanagerdb',
    storage: getRxStoragePouch('indexeddb'),
    multiInstance: false
  });


  projectsCollection = await db.addCollections({
    projects: {
      schema: projectsSchema,
      migrationStrategies: {
        // this transforms data from version 0 to version 1
        1: (doc: Project) => {
          doc.incidents = []
          return doc;
        },
        2: (doc: Project) => {
          doc.acceptanceComponents = []
          return doc;
        }
      }
    },
    tasks: {
      schema: taskSchema
    }
  });
}

/**
 * This is run via APP_INITIALIZER in app.module.ts
 * to ensure the database exists before the angular-app starts up
 */
export async function initDatabase(search: SearchService, ipc: IpcService) {

  /**
   * When server side rendering is used,
   * The database might already be there
   */
  if (!initState) {
    initState = _create();
  }
  await initState;
  console.log("DB INIT --> ok")
  let allp = await projectsCollection.projects.find().exec().then(datarr => datarr.map(data => new Project(data)));
  let alltasks = await projectsCollection.tasks.find().exec().then(datarr => datarr.map(data => new Task(data)));

  // Load database from disk if any found
  let projectsdatabase = ipc.sendSync('read-projects');
  let tasksdatabase = ipc.sendSync('read-tasks');
  console.log("Projects from disk", projectsdatabase);
  console.log("Tasks from disk", tasksdatabase);

  if (projectsdatabase) {
    console.log("Loading projects!");
    let jsondatabase = JSON.parse(projectsdatabase)
    projectsCollection.projects.importJSON(jsondatabase);
  }
  if (tasksdatabase) {
    console.log("Loading tasks!");
    let jsondatabase = JSON.parse(tasksdatabase)
    projectsCollection.tasks.importJSON(jsondatabase);
  }

  // Save all projects to disk when an update is done
  projectsCollection.projects.$.subscribe(() => {
    projectsCollection.projects.exportJSON().then((json) => {
      console.log("JSON", json);
      ipc.send('async-save-projects', json);
    })
  })
  projectsCollection.tasks.$.subscribe(() => {
    projectsCollection.tasks.exportJSON().then((json) => {
      console.log("JSON", json);
      ipc.send('async-save-tasks', json);
    })
  })


  await search.init(allp, alltasks)
}
