
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
    pplink: string; // Link to the sharepoint page

    actors: Array<{ name: string, dga: string }>;

}