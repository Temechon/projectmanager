import { Injectable } from '@angular/core';
import { addPouchPlugin, createRxDatabase, getRxStoragePouch, RxCollection, RxDatabase } from 'rxdb';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { guid, IProject, Project, TEST_PROJECT } from '../model/project.model';
import { ITask, Task } from '../model/task.model';
import { PMCollections, PMDatabase, projectsSchema, taskSchema } from './dbmodel';
import { SearchService } from './search.service';

declare let Neutralino: any;

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
      schema: projectsSchema
    },
    tasks: {
      schema: taskSchema
    }
  });

  let allprojects = await projectsCollection.projects.find().exec();

  if (allprojects.length === 0) {
    // If no projects found on database, check if this is prod environment
    if (environment.production) {
      // If production, load database from storage
      Neutralino.events.on('ready', () => {
        // get projects
        Neutralino.storage.getData('PMDATABASE_PROJECTS').then(strdatabase => {
          console.log("Projects database", strdatabase)
          if (strdatabase) {
            let jsondatabase = JSON.parse(strdatabase)
            projectsCollection.projects.importJSON(jsondatabase);
          } else {

          }
        })
        // get tasks
        Neutralino.storage.getData('PMDATABASE_TASKS').then(strdatabase => {
          console.log("Tasks database", strdatabase)
          if (strdatabase) {
            let jsondatabase = JSON.parse(strdatabase)
            projectsCollection.tasks.importJSON(jsondatabase);
          } else {

          }
        })
      })
    }

  }

  if (environment.production) {
    projectsCollection.projects.$.subscribe(() => {
      projectsCollection.projects.exportJSON().then((json) => {
        console.log("JSON", json);
        Neutralino.storage.setData('PMDATABASE_PROJECTS', JSON.stringify(json))
      })
    })
    projectsCollection.tasks.$.subscribe(() => {
      projectsCollection.tasks.exportJSON().then((json) => {
        console.log("JSON", json);
        Neutralino.storage.setData('PMDATABASE_TASKS', JSON.stringify(json))
      })
    })
  }
}

/**
 * This is run via APP_INITIALIZER in app.module.ts
 * to ensure the database exists before the angular-app starts up
 */
export async function initDatabase(search: SearchService) {

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

  await search.init(allp)
}
