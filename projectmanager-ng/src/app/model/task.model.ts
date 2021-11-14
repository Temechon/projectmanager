import _ from "underscore";
import { guid } from "./project.model";

export abstract class ITask {
    id: string;
    content: string;
    projectid: string;
    projectinternalid: string;
    status: string;
    date: string;
    index: number;
}

export class Task extends ITask {

    constructor(rxdoc: ITask) {
        super();

        this.id = rxdoc.id || guid();
        this.content = rxdoc.content;
        this.projectid = rxdoc.projectid;
        this.projectinternalid = rxdoc.projectinternalid;
        this.status = rxdoc.status;
        this.date = rxdoc.date;
        this.index = rxdoc.index;
    }

    toObject(): ITask {
        // Remove undefined properties from object, otherwise it cannot be saved
        let res: any = _.pick(this, (value: any) => {
            return !_.isUndefined(value);
        });

        return res;
    }

}