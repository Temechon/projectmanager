import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pin } from '../model/pin.model';
import { DatabaseService } from './database.service';


@Injectable({
    providedIn: 'root'
})
export class PinService {

    private _isPinned = new BehaviorSubject<boolean>(false);

    pin(pin: Pin) {
        this.db.savePin(pin).then(() => {
            this._isPinned.next(true);
        })
    }

    unpin(pin: Pin) {
        // Get all pins from database
        this.db.getPins().then(allPins => {

            let pinInThisCategory = allPins.filter(p => p.projectid === pin.projectid && p.category === pin.category);
            if (pinInThisCategory) {
                let pinid = "";
                if (pin.params) {
                    pinid = pinInThisCategory.filter(p => p.params === pin.params)[0].id;
                } else {
                    pinid = pinInThisCategory[0].id
                }
                this.db.deletePin(pinid).then(() => {
                    this._isPinned.next(false);
                })
            } else {
                // Nothing to unpin
            }
        })
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
                this.db.deletePin(pin.id).then(() => {
                    this._isPinned.next(false);
                })
            }
        })
    }


    /**
     * Returns true if the project is pinned in the specified category
     * @param {string} projectid - The project id of the project you want to pin
     * @param {string} category - The category of the pin.
     * @param {string} [childrenid] - The id of the child node. If this is not provided, then the
     * method will return true if there is at least one pin in the category.
     * @returns The method returns a boolean value.
     */
    setPinned(projectid: string, category: string, childrenid?: string) {

        console.log("set pinned");

        this.db.getPins().then(allPins => {

            let pinInThisCategory = allPins.filter(p => p.projectid === projectid && p.category === category);
            if (pinInThisCategory) {
                if (childrenid) {
                    this._isPinned.next(pinInThisCategory.filter(p => p.params === childrenid).length > 0);
                } else {
                    this._isPinned.next(pinInThisCategory.length > 0);
                }
            } else {
                this._isPinned.next(false);
            }
        })
    }

    isPinned() {
        return this._isPinned.asObservable();
    }

    constructor(protected db: DatabaseService) {

    }

}

