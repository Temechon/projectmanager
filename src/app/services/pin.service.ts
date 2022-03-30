import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class PinService {


    /**
     * Unpin a report 
     * @param {string} id - The id of the report to unpin.
     */
    unpinReport(id: string) {
        throw new Error('Method not implemented.');
    }

    constructor() {

    }

}

