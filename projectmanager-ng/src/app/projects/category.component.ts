import { Directive, OnInit, Renderer2 } from "@angular/core";
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
        protected index: SearchService,
        protected renderer: Renderer2
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
        this.db.saveProject(this.project.toObject());
        this.index.updateProject(this.project);
    }

    ngOnDestroy() {
        this.routesub?.unsubscribe();
    }
}
