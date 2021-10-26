import { Injectable } from '@angular/core';
import { addPouchPlugin, createRxDatabase, getRxStoragePouch, RxCollection, RxDatabase } from 'rxdb';
import { map, Observable } from 'rxjs';
import { IProject, Project, TEST_PROJECT } from '../model/project.model';
import { PMCollections, PMDatabase, projectsSchema } from './dbmodel';
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

  saveProject(p: IProject) {
    return projectsCollection.projects.atomicUpsert(p);
  }

}

let projectsCollection: PMCollections;
let initState: null | Promise<any> = null;

async function _create() {

  // await Neutralino.storage.setData('PM_DATABASE', "COUCOU FROM STORAGE");
  // let data = await Neutralino.storage.getData('PM_DATABASE');
  // console.log(`ICI : Data: ${data}`);

  addPouchPlugin(require('pouchdb-adapter-indexeddb'));

  let db = await createRxDatabase<PMDatabase>({
    name: 'projectmanagerdb',
    storage: getRxStoragePouch('indexeddb'),
    multiInstance: false
  });
  projectsCollection = await db.addCollections({
    projects: {
      schema: projectsSchema
    }
  })
  let allprojects = await projectsCollection.projects.find().exec();
  if (allprojects.length === 0) {
    await db.projects.insert(
      TEST_PROJECT()
    );
  }
  // console.log(projectsCollection);
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
