import { Injectable } from '@angular/core';
import IndexedStorage from '@lokidb/indexed-storage';
import { Doc } from '@lokidb/indexed-storage/types/common/types';
import Loki from '@lokidb/loki';
import { guid, Project } from '../model/project.model';


@Injectable({
  providedIn: 'root'
})
export class DatabaseLokiService {


  constructor() {

  }

  getProject(id: string): Doc<Project> {
    return DB_INSTANCE.getCollection('projects').findOne({ id } as any) as Doc<Project>;
  }

  getProjects(): Doc<Project>[] {
    return DB_INSTANCE.getCollection('projects').find() as Doc<Project>[];
  }

  addProject(p: Project) {
    return DB_INSTANCE.getCollection('projects').insert(p);
  }

  saveProject(p: Doc<Project>) {
    DB_INSTANCE.getCollection('projects').update(p);
  }

}

let DB_INSTANCE: Loki;
let initState: null | Promise<any> = null;

async function _create() {

  let idbAdapter = new IndexedStorage();
  let db = new Loki("projectmanager");
  await db.initializePersistence({ adapter: idbAdapter, autosave: true, autoload: true });
  let collection = db.getCollection('projects');

  if (collection) {
    console.log("Collection already exists! Nothing to do");
  } else {
    console.log("Collection does not exist!Initialize it");

    // All options here:https://github.com/LokiJS-Forge/LokiDB/blob/57e2ff8/packages/loki/src/collection.ts#L178
    db.addCollection<any>("projects", { unique: ['id'] });
  }

  DB_INSTANCE = db;

  return db.saveDatabase();

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
