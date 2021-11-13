import _ from "underscore";
import { guid } from "./project.model";

export abstract class ITask {
    id: string;
    content: string;
    projectid: string;
    projectname: string;
    projectinternalid: string;
    status: string;
    date: string;
}

export class Task extends ITask {

    constructor(rxdoc: ITask) {
        super();

        this.id = rxdoc.id || guid();
        this.content = rxdoc.content;
        this.projectid = rxdoc.projectid;
        this.projectname = rxdoc.projectname;
        this.projectinternalid = rxdoc.projectinternalid;
        this.status = rxdoc.status;
        this.date = rxdoc.date;
    }

    toObject(): ITask {
        // Remove undefined properties from object, otherwise it cannot be saved
        let res: any = _.pick(this, (value: any) => {
            return !_.isUndefined(value);
        });

        return res;
    }

}