import { Directive, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Project } from "../model/project.model";
import { DatabaseLokiService } from "../services/database-loki.service";

@Directive()
export class CategoryComponent implements OnInit {

    constructor(
        protected route: ActivatedRoute,
        protected db: DatabaseLokiService,
        protected router: Router
    ) { }

    project: Project
    routesub: Subscription;

    ngOnInit(): void {

        this.routesub = this.route.parent.data.subscribe(data => {
            this.project = data.project
            console.log("PROJECT ICI", this.project)
        })
    }

    save() {
        console.log("Saving project", this.project);
        this.db.saveProject(this.project.toObject());
        console.log("Done!");
    }

    ngOnDestroy() {
        this.routesub.unsubscribe();
    }
}
