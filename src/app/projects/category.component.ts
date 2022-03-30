import { Directive, OnInit, Renderer2 } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import _ from "underscore";
import { Pin, Project } from "../model/project.model";
import { DatabaseService } from "../services/database.service";
import { IpcService } from "../services/ipc.service";
import { PinService } from "../services/pin.service";
import { SearchService } from "../services/search.service";

@Directive()
export abstract class CategoryComponent implements OnInit {

    constructor(
        protected route: ActivatedRoute,
        protected db: DatabaseService,
        protected router: Router,
        protected index: SearchService,
        protected renderer: Renderer2,
        protected ipcService: IpcService,
        protected pinner: PinService
    ) { }

    project: Project
    routesub: Subscription;

    ngOnInit(): void {

        this.routesub = this.route.parent.data.subscribe(data => {
            this.project = data.project
        })
    }

    save(): Promise<any> {
        return this.db.saveProject(this.project.toObject()).then(() => {
            this.index.updateProject(this.project);
        })
    }

    ngOnDestroy() {
        this.routesub?.unsubscribe();
    }

    pinElement() {
        let pin = this._pin();
        this.pinner.pin(pin);
    }

    protected abstract _pin(): Pin;
}
