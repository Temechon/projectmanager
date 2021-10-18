import * as _ from "underscore";

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

    constructor(params: any) {
        this.id = params.id || guid();
        this.internalid = params.internalid;
        this.name = params.name;
    }

    toObject(): any {
        // Remove undefined properties from object, otherwise it cannot be saved
        let res: any = _.pick(this, (value: any) => {
            return !_.isUndefined(value);
        });

        delete res.id;
        return res;
    }
}