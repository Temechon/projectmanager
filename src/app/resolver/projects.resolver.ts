import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { Project } from '../model/project.model';
import { DatabaseLokiService } from '../services/database-loki.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectResolver {

    constructor(
        private database: DatabaseLokiService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Project> {

        // Check if the note id is in the curent route
        let id = route.paramMap.get('id');
        console.log("PEOPLE ID", id)

        // Check if the project is the same as the previous one
        if (id) {
            // Otherwise, retrieve it from database
            let p = this.database.get(id);
            return of(p);
        } else {
            return EMPTY;

        }
    }
}
