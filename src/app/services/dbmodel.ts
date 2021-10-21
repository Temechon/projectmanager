import { RxCollection, RxDatabase, RxDocument, RxJsonSchema } from "rxdb";
import { Project } from "../model/project.model";

type RxProject = RxDocument<Project>;

export type RxProjectCollection = RxCollection<Project>;

export type PMCollections = {
    projects: RxProjectCollection
}

export type PMDatabase = RxDatabase<PMCollections>;

export const projectsSchema: RxJsonSchema<Project> = {
    title: 'project schema',
    description: 'describes a project being',
    version: 0,
    keyCompression: true,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        internalid: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        pplink: {
            type: 'string'
        },
        actors: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    },
                    dga: {
                        type: 'string'
                    }
                }
            }
        }
    },
    required: ['id']
};