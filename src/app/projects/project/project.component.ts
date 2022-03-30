import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { guid, Pin, Project } from 'src/app/model/project.model';
import { DatabaseService } from 'src/app/services/database.service';
import { ReportsComponent } from '../categories/reports/reports.component';
import { CategoryComponent } from '../category.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  constructor(
    private db: DatabaseService,
    protected route: ActivatedRoute,
    private router: Router) { }

  routesub: Subscription;
  project: Project
  pinned: boolean = false;

  categoryComponent: CategoryComponent;


  ngOnInit(): void {
    this.routesub = this.route.data.subscribe(data => {
      this.project = data.project;
    })
  }

  /**
   * Called when a project category is selected
   * @param componentRef 
   */
  onActivate(componentRef: CategoryComponent) {
    this.categoryComponent = componentRef;

    // Get all pins
    this.db.getPins$().subscribe((pp: Array<Pin>) => {
      // If this category of this projet is pinned, highlight the button and set it to unpin
      let route = this.router.url.split('/')
      let pins = pp.filter(d => d.projectinternalid == this.project.internalid && d.category == route[3].split('?')[0]);

      if (pins.length === 0) {
        this.pinned = false;
      }
      if (pins.length === 1) {
        this.pinned = true;
      }
      // If more than one pin, check on report parameters
      if (pins.length > 1) {
        // let pin = pins.find(d => d.params?.id == (this.categoryComponent as ReportsComponent).selected?.id);
        // if (pin) {
        //   this.pinned = true;
        // } else {
        //   this.pinned = false;
        // }
      }

    })
  }

  /**
   * Adds a pin to the current element
   */
  pin() {
    let route = this.router.url.split('/')
    let pin = new Pin({
      id: guid(),
      projectid: this.project.id,
      title: '',
      projectinternalid: this.project.internalid,
      category: route[3].split('?')[0],
      params: null
    })

    switch (pin.category) {
      case "reports":
        // Get selected report
        // let report = (this.categoryComponent as ReportsComponent).selected;
        // pin.title = report.title;

        // // Save report id in pin params
        // pin.params = { id: report.id };

        break;
      case "general":
        pin.title = "Infos générales";
        break;
      case "notes":
        pin.title = "Notes";
        break;
      case "actors":
        pin.title = "Acteurs";
        break;
      case "testCases":
        pin.title = "Cas de test";
        break;
      case "acceptanceTests":
        pin.title = "Recette";
        break;
    }

    this.db.savePin(pin);
  }

  ngOnDestroy() {
    this.routesub?.unsubscribe();
  }

}
