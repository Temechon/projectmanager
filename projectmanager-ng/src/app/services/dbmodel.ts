import { RxCollection, RxDatabase, RxDocument, RxJsonSchema } from "rxdb";
import { IProject } from "../model/project.model";

export type RxProject = RxDocument<IProject>;

export type RxProjectCollection = RxCollection<IProject>;

export type PMCollections = {
    projects: RxProjectCollection
}

export type PMDatabase = RxDatabase<PMCollections>;

export const projectsSchema: RxJsonSchema<IProject> = {
    title: 'project schema',
    description: 'describes a project',
    version: 0,
    keyCompression: true,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        internalid: {
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
                    },
                    comment: {
                        type: 'string'
                    }
                }
            }
        },
        recette_date: {
            type: 'string'
        },
        prod_date: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        reports: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    title: {
                        type: 'string'
                    },
                    content: {
                        type: 'string'
                    },
                    date: {
                        type: 'string'
                    }
                }
            }
        },
        folder: {
            type: 'string'
        },
        activities: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    date: {
                        type: 'string'
                    },
                    content: {
                        type: 'string'
                    },
                    status: {
                        type: 'string'
                    }
                }
            }
        },
        notes: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    date: {
                        type: 'string'
                    },
                    content: {
                        type: 'string'
                    }
                }
            }
        }
    },
    required: ['id']
};