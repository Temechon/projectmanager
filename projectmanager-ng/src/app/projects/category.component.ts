import { Directive, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import _ from "underscore";
import { Project } from "../model/project.model";
import { DatabaseService } from "../services/database.service";
import { SearchService } from "../services/search.service";

@Directive()
export class CategoryComponent implements OnInit {

    constructor(
        protected route: ActivatedRoute,
        protected db: DatabaseService,
        protected router: Router,
        protected index: SearchService
    ) { }

    project: Project
    routesub: Subscription;

    ngOnInit(): void {

        // save into local storage the last route
        let url = this.router.url;
        let path = url.substr(_.lastIndexOf(url, '/') + 1, url.length);
        localStorage.setItem('PM_PROJECT_PATH', path);

        this.routesub = this.route.parent.data.subscribe(data => {
            this.project = data.project
        })
    }

    save() {
        console.log("Saving project", this.project);
        this.db.saveProject(this.project.toObject());
        this.index.updateProject(this.project);
        console.log("Done!");
    }

    ngOnDestroy() {
        this.routesub?.unsubscribe();
    }
}
