import _ from "underscore";
import { RxProject } from "../services/dbmodel";

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export type Report = {
    id: string,
    content: string,
    title: string,
    date: string
}

export type TaskItem = {
    date: string,
    title: string,
    enddate: string,
    status: string,
    actor: string,
    comment: string
}

export abstract class IProject {

    id: string;
    name: string;
    internalid: string;
    /** Lien vers le portefeuille projet */
    pplink: string;
    folder: string;
    actors: Array<{ name: string, dga: string, comment: string }>;
    /** Date de la recette prévue */
    recette_date: string;
    /** Date de la VP */
    prod_date: string;
    /** Description du projet */
    description: string;
    /** Tous les comptes-rendus du projet */
    reports: Array<Report>;
    /** Tous les items dans le suivi du projet */
    taskitems: Array<TaskItem>;

}

export class Project extends IProject {

    constructor(rxdoc: any = {}) {
        super();

        this.id = rxdoc.id || guid();
        this.name = rxdoc.name;
        this.internalid = rxdoc.internalid;
        this.pplink = rxdoc.pplink;
        this.actors = rxdoc.actors?.slice().map(_.clone) || []; // Clone because rxdb returns read only objects - why ??
        this.recette_date = rxdoc.recette_date;
        this.prod_date = rxdoc.prod_date;
        this.description = rxdoc.description;
        this.reports = rxdoc.reports?.slice().map(_.clone) || [];
        this.folder = rxdoc.folder;
        this.taskitems = rxdoc.taskitems?.slice().map(_.clone) || [];
    }

    toObject(): IProject {
        // Remove undefined properties from object, otherwise it cannot be saved
        let res: any = _.pick(this, (value: any) => {
            return !_.isUndefined(value);
        });

        return res;
    }

}



export function TEST_PROJECT(): IProject {
    return {
        id: guid(),
        internalid: "1734",
        name: 'Affichage mode connecté',
        pplink: "",
        actors: [],
        recette_date: "30/10/2021",
        prod_date: "24/11/2021",
        description: "description du projet",
        reports: [],
        folder: "",
        taskitems: []
    }
}
