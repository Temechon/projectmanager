import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, from, map, Observable, tap } from 'rxjs';
import { IProject, Report } from '../model/project.model';
import { DatabaseService } from '../services/database.service';

@Injectable({
    providedIn: 'root',
})
export class ReportResolver {

    constructor(
        private database: DatabaseService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Report> {

        // Get the project id from the parent route
        let projectId = route.parent.parent.paramMap.get('id');

        // Check if the report id is in the curent route
        let reportid = route.paramMap.get('id');

        if (projectId) {
            return from(this.database.getProject(projectId)).pipe(
                map(
                    (project: IProject) => project.reports.find(report => report.id === reportid) as Report
                )
            )
        } else {
            return EMPTY;

        }
    }
}
