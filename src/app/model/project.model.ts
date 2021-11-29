import randomColor from "randomcolor";
import _ from "underscore";
import { DateTime } from "luxon";

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

export type Activity = {
    id: string,
    date: string,
    content: string,
    status: string,
}

export type Note = {
    id: string,
    date: string,
    content: string
}

export type Incident = {
    id: string,
    detail: string,
    comment: string,
    status: string
}

export type AcceptanceComponent = {
    id: string,
    title: string,
    integration_date: string,
    recette_date: string
}

export abstract class IProject {

    id: string;
    name: string;
    internalid: string;
    /** hex string of the project color */
    color: string;
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
    activities: Array<Activity>;
    /** All quick notes */
    notes: Array<Note>;
    /** All incidents */
    incidents: Array<Incident>;
    /** All components to be tested */
    acceptanceComponents: Array<AcceptanceComponent>;

}

export class Project extends IProject {

    constructor(rxdoc: any = {}) {
        super();

        this.id = rxdoc.id || guid();
        this.name = rxdoc.name;
        this.internalid = rxdoc.internalid;
        this.color = rxdoc.color || randomColor({ format: 'hex' });
        this.pplink = rxdoc.pplink;
        this.actors = rxdoc.actors?.slice().map(_.clone) || []; // Clone because rxdb returns read only objects - why ??
        this.recette_date = rxdoc.recette_date;
        this.prod_date = rxdoc.prod_date;
        this.description = rxdoc.description;
        this.reports = rxdoc.reports?.slice().map(_.clone) || [];
        this.folder = rxdoc.folder;
        this.activities = rxdoc.activities?.slice().map(_.clone) || [];
        this.notes = rxdoc.notes?.slice().map(_.clone) || [];
        this.incidents = rxdoc.incidents?.slice().map(_.clone) || [];
        this.acceptanceComponents = rxdoc.acceptanceComponents?.slice().map(_.clone) || [];
    }

    toObject(): IProject {
        // Remove undefined properties from object, otherwise it cannot be saved
        let res: any = _.pick(this, (value: any) => {
            return !_.isUndefined(value);
        });

        return res;
    }

    /**
     * Returns a date time object corresponding to the given string. The first part of the string corresponding to a date is given into account.
     */
    private _getDate(str): DateTime {
        // Use regexp to extract date from string
        // format dd/MM or dd-MM
        let ddmm = /\d{2}[-\/]\d{2}\s?/;
        const dateDdmm = ddmm.exec(str);
        if (dateDdmm) {
            // Get separator
            const sep = dateDdmm[0].indexOf('/') > -1 ? '/' : '-';
            return DateTime.fromFormat(dateDdmm[0].trim(), `dd${sep}MM`);
        }
        // format dd/MM/YY or dd-MM-YY
        const ddmmYY = /\d{2}[-\/]\d{2}[-\/]\d{2}\s?/;
        const dateDdmmYY = ddmmYY.exec(str);
        if (dateDdmmYY) {
            // Get separator
            const sep = dateDdmmYY[0].indexOf('/') > -1 ? '/' : '-';
            return DateTime.fromFormat(dateDdmmYY[0].trim(), `dd${sep}MM${sep}YY`);
        }
    }

    get prodDate(): DateTime {
        return this._getDate(this.prod_date);
    }

    get recetteDate(): DateTime {
        return this._getDate(this.recette_date);
    }

}
