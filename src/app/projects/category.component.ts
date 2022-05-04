import { Directive, OnInit, Renderer2 } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import _ from "underscore";
import { Pin } from "../model/pin.model";
import { Project } from "../model/project.model";
import { ConfirmService } from "../services/confirm.service";
import { DatabaseService } from "../services/database.service";
import { DialogService } from "../services/dialog.service";
import { DocxService } from "../services/docx.service";
import { ExcelService } from "../services/excel.service";
import { IpcService } from "../services/ipc.service";
import { PinService } from "../services/pin.service";
import { SearchService } from "../services/search.service";
import { ToastService } from "../services/toast.service";

@Directive()
export abstract class CategoryComponent implements OnInit {

    constructor(
        protected route: ActivatedRoute,
        protected db: DatabaseService,
        protected router: Router,
        protected index: SearchService,
        protected renderer: Renderer2,
        protected ipcService: IpcService,
        protected pinner: PinService,
        protected excel: ExcelService,
        protected toaster: ToastService,
        protected docx: DocxService,
        protected dialog: DialogService,
        protected confirmService: ConfirmService
    ) {
    }

    project: Project
    routesub: Subscription;

    abstract get category(): string;

    ngOnInit(): void {

        // Listen to the parent route and check if this category has been pinned
        this.routesub = this.route.url.subscribe(url => {
            let currentRoute = this.route;
            this.project = currentRoute.parent.snapshot.data.project


            let childrenid = "";
            if (!this.project) {
                currentRoute = currentRoute.parent;
                // Then it's an access to a test case. Retrieve the project from the parent parent route.
                this.project = currentRoute.parent.snapshot.data.project
            }


            if (currentRoute.snapshot.firstChild) {
                // In this case, it's a direct access to a sub element (report, test case details, etc)
                childrenid = currentRoute.snapshot.firstChild.paramMap.get('id');
                console.log("CHILDREN ID", childrenid);
            }
            let projectid = this.project.id;
            let category = this.category;

            this.pinner.setPinned(projectid, category, childrenid);

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
        let pin = this.createPin();
        this.pinner.pin(pin);
    }

    unpinElement() {
        let pin = this.createPin();
        this.pinner.unpin(pin);
    }

    public abstract createPin(): Pin;
}
