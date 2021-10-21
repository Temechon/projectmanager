import { Injectable } from '@angular/core';
import { addPouchPlugin, createRxDatabase, getRxStoragePouch } from 'rxdb';
import { Project, TEST_PROJECT } from '../model/project.model';
import { PMDatabase, projectsSchema } from './dbmodel';



@Injectable({
  providedIn: 'root'
})
export class DatabaseLokiService {


  constructor() {

  }

  getProject(id: string): any {
    // return DB_INSTANCE.getCollection('projects').findOne({ id } as any) as Doc<Project>;
  }

  getProjects() {
    // return DB_INSTANCE.allDocs();
    // return DB_INSTANCE.getCollection('projects').find() as Doc<Project>[];
  }

  addProject(p: Project) {
    // return DB_INSTANCE.getCollection('projects').insert(p);
  }

  saveProject(p: any) {
    // DB_INSTANCE.getCollection('projects').update(p);
  }

}

let DB_INSTANCE: any;
let initState: null | Promise<any> = null;

async function _create() {

  addPouchPlugin(require('pouchdb-adapter-indexeddb'));


  let db = await createRxDatabase<PMDatabase>({
    name: 'projectmanagerdb',
    storage: getRxStoragePouch('indexeddb'),
    multiInstance: false
  });
  await db.addCollections({
    projects: {
      schema: projectsSchema
    }
  })
  await db.projects.insert(
    TEST_PROJECT()
  );

  console.log(db);


  DB_INSTANCE = db;
}

/**
 * This is run via APP_INITIALIZER in app.module.ts
 * to ensure the database exists before the angular-app starts up
 */
export async function initDatabase() {

  /**
   * When server side rendering is used,
   * The database might already be there
   */
  if (!initState) {
    console.log('initDatabase()');
    initState = _create();
  }
  await initState;
}
