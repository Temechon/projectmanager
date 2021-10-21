
import { DateTime } from "luxon";


export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class Project {

    id: string;
    internalid: string;
    name: string;
    /** Lien vers le portefeuille projet */
    pplink: string;
    actors: Array<{ name: string, dga: string }>;
    /** Date de la recette prévue */
    recette_date: string;
    /** Date de la VP */
    prod_date: string;
    /** Description du projet */
    description: string;

    static TEST_PROJECT: Project = {
        id: guid(),
        internalid: "1734",
        name: 'Affichage mode connecté',
        pplink: "",
        actors: [],
        recette_date: "30/10/2021",
        prod_date: "24/11/2021",
        description: "description du projet"
    }

}