import { Injectable } from '@angular/core';
import { addPouchPlugin, createRxDatabase, getRxStoragePouch } from 'rxdb';
import { map, Observable } from 'rxjs';
import { Pin } from '../model/pin.model';
import { IProject, Project } from '../model/project.model';
import { ITask, Task } from '../model/task.model';
import { pinSchema, PMCollections, PMDatabase, projectsSchema, taskSchema } from './dbmodel';
import { IpcService } from './ipc.service';
import { SearchService } from './search.service';
import { SyncService } from './sync.service';


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

  getTasks(): Promise<Task[]> {
    return projectsCollection.tasks.find().exec().then(datarr => datarr.map(data => new Task(data)));
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

  // PINS
  getPins$(): Observable<Pin[]> {
    return projectsCollection.pins.find().$.pipe(map(datarr => datarr.map(data => new Pin(data))));
  }
  getPins(): Promise<Pin[]> {
    return projectsCollection.pins.find().exec().then(datarr => datarr.map(data => new Pin(data)));
  }

  savePin(pin: Pin) {
    return projectsCollection.pins.atomicUpsert(pin);
  }

  deletePin(pid: string): Promise<any> {
    return projectsCollection.pins.findOne({
      selector: {
        id: pid
      }
    }).remove()
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
        },
        3: (doc: Project) => {
          doc.spira_projectid = "";
          return doc;
        },
        4: (doc: Project) => {
          doc.milestones = [];
          doc.status = '';
          doc.domain = '';
          doc.domain_manager = '';
          return doc;
        },
        5: (doc: Project) => {
          doc.actors.map(a => a.type = '');
          return doc;
        },
        6: (doc: any) => {
          return new Project(doc);
        },
        7: (doc: Project) => {
          doc.testCasesList = [];
          return doc;
        },
        8: (doc: Project) => {
          doc.actions = [];
          return doc;
        },
      }
    },
    tasks: {
      schema: taskSchema
    },
    pins: {
      schema: pinSchema
    }
  });
}

/**
 * This is run via APP_INITIALIZER in app.module.ts
 * to ensure the database exists before the angular-app starts up
 */
export async function initDatabase(search: SearchService, ipc: IpcService, sync: SyncService) {

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

  // Save all projects to disk when an update is done
  projectsCollection.projects.$.subscribe(() => {
    console.log("On se met en statut syncing");
    sync.syncStatus.next(SyncService.STATUS_SYNCING);
    projectsCollection.projects.exportJSON().then((json) => {
      // console.log("JSON", json);
      ipc.send('async-save-projects', json);
    })
  })
  projectsCollection.tasks.$.subscribe(() => {
    projectsCollection.tasks.exportJSON().then((json) => {
      // console.log("JSON", json);
      ipc.send('async-save-tasks', json);
    })
  })

  /**
   * Action done when the save status is returned by electron window
   */
  ipc.on('save-status', (evt, message: { status: boolean }) => {
    // console.log("Message reçu d'electron", message);

    // Update the sync status
    if (message.status) {
      sync.syncStatus.next(SyncService.STATUS_SYNCED);
      // console.log("tout est synchro ! On envoie au service");
    } else {
      sync.syncStatus.next(SyncService.STATUS_ERROR);
      // console.log("Ya une erreur");
    }
  });


  await search.init(allp, alltasks)
}
