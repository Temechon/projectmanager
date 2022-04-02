

export abstract class IPin {

    id: string;
    projectid: string;
    title: string;
    projectinternalid: string;
    category: string;
    params: string
}

/** A project element that can be pinned on the window */
export class Pin extends IPin {

    constructor(pin: IPin) {
        super();

        this.id = pin.id;
        this.projectid = pin.projectid;
        this.title = pin.title;
        this.projectinternalid = pin.projectinternalid;
        this.category = pin.category;
        this.params = pin.params;
    }
}
