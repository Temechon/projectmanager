import { Injectable } from '@angular/core';
import { addPouchPlugin, createRxDatabase, getRxStoragePouch, RxCollection, RxDatabase, RxDocument } from 'rxdb';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  addProject(project: any) {
    DB_INSTANCE.projects.insert({
      id: 'jch',
      name: 'Project 1',
      startdate: 100,
      skills: [
        { name: 'skill1', damage: 3 }
      ]
    } as RxProjectDocument)
  }

  find() {
    return DB_INSTANCE.projects.findOne({
      selector: {
        id: 'jch'
      }
    }).exec();
  }

  get db(): any {
    return DB_INSTANCE;
  }

}

let DB_INSTANCE: RxProjectsDatabase;
let initState: null | Promise<any> = null;

let schema = {
  "title": "projectmanager schema",
  "version": 0,
  "description": "describes a simple project",
  "primaryKey": "id",
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "startdate": {
      "type": "number"
    },
    "skills": {
      "type": "array",
      "maxItems": 5,
      "uniqueItems": true,
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "damage": {
            "type": "number"
          }
        }
      }
    }
  },
  "required": [
    "id",
    "name"
  ]
}

export type RxProjectType = {
  id: string;
  name: string;
  startdate: number;
  skills: Array<{
    name: string;
    damage: number;
  }>;
};
export type RxProjectDocument = RxDocument<RxProjectType>;
export type RxProjectCollection = RxCollection<RxProjectDocument>;

// All database collections
export type RxProjectManagement = {
  projects: RxProjectCollection
}

export type RxProjectsDatabase = RxDatabase<RxProjectManagement>;


async function _create(): Promise<RxProjectsDatabase> {

  addPouchPlugin(require('pouchdb-adapter-indexeddb'));

  const db = await createRxDatabase<RxProjectManagement>({
    name: 'projectmanagerdb',
    storage: getRxStoragePouch('indexeddb')
  });

  // db.exportJSON().then(json => console.log(json));
  await db.addCollections({
    projects: {
      schema: schema
    }
  });

  console.dir(db.projects.name);
  return db;
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
    initState = _create().then(db => DB_INSTANCE = db);
  }
  await initState;
}
