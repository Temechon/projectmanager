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

    get prodDate(): DateTime {
        return getDateFromString(this.prod_date);
    }

    get recetteDate(): DateTime {
        return getDateFromString(this.recette_date);
    }

}

/**
 * Returns a date time object corresponding to the given string. The first part of the string corresponding to a date is given into account.
 */
export function getDateFromString(str: string): DateTime {
    if (!str) {
        return null;
    }
    // Use regexp to extract date from string
    // format dd/MM or dd-MM
    const ddmmYY = /^\d{1,2}[-\/]\d{1,2}(?:[-\/]\d{2,4})?/;
    const dateDdmmyy = ddmmYY.exec(str);
    if (dateDdmmyy) {
        let date = dateDdmmyy[0].trim();
        // Get separator
        const sep = date.indexOf('/') > -1 ? '/' : '-';
        // extract day and month from date
        let day = date.split(sep)[0];
        let month = date.split(sep)[1];
        // Add 0 if day or month is only one digit
        day = day.padStart(2, '0');
        month = month.padStart(2, '0');
        // Check if year is present
        let year = date.split(sep).length > 2 ? date.split(sep)[2] : null;
        if (year) {
            year = year.padStart(4, '20');

            const dated = DateTime.fromFormat(`${day}${sep}${month}${sep}${year}`, `dd${sep}MM${sep}yyyy`);
            return dated
        } else {
            const dated = DateTime.fromFormat(`${day}${sep}${month}`, `dd${sep}MM`);
            return dated
        }
    }
    return null;
}
