import { Injectable } from '@angular/core';
import { Pin } from '../model/project.model';
import { DatabaseService } from './database.service';


@Injectable({
    providedIn: 'root'
})
export class PinService {

    pin(pin: Pin) {
        this.db.savePin(pin);
    }

    /**
     * Unpin a report 
     * @param {string} id - The id of the report to unpin.
     */
    unpinReport(id: string) {
        // Get all pins from database
        this.db.getPins().then(pins => {
            // Find the pin where the params id is the report id
            let pin = pins.find(pin => pin.params === id);
            // If the pin is found, remove it from the database
            if (pin) {
                this.db.deletePin(pin);
            }
        })
    }

    constructor(
        protected db: DatabaseService,) {

    }

}

