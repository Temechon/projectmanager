import { RxCollection, RxDatabase, RxJsonSchema } from "rxdb";
import { IPin } from "../model/pin.model";
import { IProject } from "../model/project.model";
import { ITask } from "../model/task.model";

export type PMCollections = {
    projects: RxCollection<IProject>,
    tasks: RxCollection<ITask>,
    pins: RxCollection<IPin>
}

export type PMDatabase = RxDatabase<PMCollections>;


export const pinSchema: RxJsonSchema<IPin> = {
    title: 'pins schema',
    description: 'describes all pins on the top of the window',
    version: 0,
    keyCompression: true,
    primaryKey: 'id',
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string'
        },
        projectid: {
            type: 'string'
        },
        title: {
            type: 'string'
        },
        projectinternalid: {
            type: 'string'
        },
        category: {
            type: 'string'
        },
        params: {
            type: ["string", "null"]
        },

    }
}

export const taskSchema: RxJsonSchema<ITask> = {
    title: 'tasks schema',
    description: 'describes a todo task',
    version: 0,
    keyCompression: true,
    primaryKey: 'id',
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string'
        },
        content: {
            type: 'string'
        },
        projectid: {
            type: 'string'
        },
        projectinternalid: {
            type: 'string'
        },
        status: {
            type: 'string'
        },
        date: {
            type: 'string'
        },
        index: {
            type: 'number'
        }
    }
}

export const projectsSchema: RxJsonSchema<IProject> = {
    title: 'project schema',
    description: 'describes a project',
    version: 10,
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
        color: {
            type: 'string'
        },
        priority: {
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
                    },
                    type: {
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
                    },
                    pinned: {
                        type: 'boolean'
                    }
                }
            }
        },
        incidents: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    detail: {
                        type: 'string'
                    },
                    comment: {
                        type: 'string'
                    },
                    status: {
                        type: 'string'
                    }
                }
            }
        },
        acceptanceComponents: {
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
                    integration_date: {
                        type: 'string'
                    },
                    recette_date: {
                        type: 'string'
                    }
                }
            }
        },
        spira_projectid: {
            type: 'string'
        },
        domain: {
            type: 'string'
        },
        domain_manager: {
            type: 'string'
        },
        status: {
            type: 'string'
        },
        milestones: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    name: {
                        type: 'string'
                    },
                    date: {
                        type: 'string'
                    },
                    type: {
                        type: 'string'
                    }
                }
            }
        },
        testCasesList: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    name: {
                        type: 'string'
                    },
                    testCases: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string'
                                },
                                name: {
                                    type: 'string'
                                },
                                category: {
                                    type: 'string'
                                },
                                test_date: {
                                    type: 'string'
                                },
                                expected_result: {
                                    type: 'string'
                                },
                                obtained_result: {
                                    type: 'string'
                                },
                                test_data: {
                                    type: 'string'
                                },
                                status: {
                                    type: 'string'
                                },
                                comments: {
                                    type: 'string'
                                },
                                index: {
                                    type: 'number'
                                }
                            }
                        }
                    }
                }
            }
        },
        actions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    name: {
                        type: 'string'
                    },
                    from: {
                        type: 'string'
                    },
                    waitingfor: {
                        type: 'string'
                    },
                    date: {
                        type: 'string'
                    },
                    status: {
                        type: 'string'
                    },
                    details: {
                        type: 'string'
                    },
                    answer: {
                        type: 'string'
                    },
                    close_date: {
                        type: 'string'
                    },
                    comments: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                date: {
                                    type: 'string'
                                },
                                content: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        }

    },
    required: ['id']
};