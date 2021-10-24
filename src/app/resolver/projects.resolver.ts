import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, from, map, Observable, of } from 'rxjs';
import { IProject } from '../model/project.model';
import { DatabaseService } from '../services/database.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectResolver {

    constructor(
        private database: DatabaseService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProject> {

        // Check if the note id is in the curent route
        let id = route.paramMap.get('id');
        if (id) {
            // Otherwise, retrieve it from database
            return from(this.database.getProject(id));
        } else {
            return EMPTY;

        }
    }
}
