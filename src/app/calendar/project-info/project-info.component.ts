import { Component, Input, OnInit } from '@angular/core';
import { AcceptanceComponent, getDateFromString, Project } from 'src/app/model/project.model';
import { DateTime } from "luxon";
import { Router } from '@angular/router';

@Component({
  selector: 'project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent implements OnInit {

  constructor(private router: Router) { }

  @Input()
  project: Project;

  @Input()
  day: DateTime;

  components: Array<AcceptanceComponent> = [];

  ngOnInit(): void {
    this.components = this.getComponentForThisDay(this.project, this.day);
  }

  // Returns true if the two given dates are the same
  isSameDate(date1: DateTime, date2: DateTime): boolean {
    if (!date1) {
      return false;
    }
    return date1.toISODate() === date2.toISODate();
  }

  isSameDateFromString(date1: string, date2: DateTime): boolean {
    if (!date1) {
      return false;
    }
    return this.isSameDate(getDateFromString(date1), date2);
  }

  /**
   * Returns the list of components for this project that has a integration or recette date for this day
   */
  getComponentForThisDay(project: Project, day: DateTime): Array<AcceptanceComponent> {
    let components = [];
    if (project.acceptanceComponents) {
      project.acceptanceComponents.some(component => {
        let intdate = getDateFromString(component.integration_date);
        let recettedate = getDateFromString(component.recette_date);

        if (intdate.toISODate() === day.toISODate()) {
          components.push(component);
        }
        else if (recettedate.toISODate() === day.toISODate()) {
          components.push(component);
        }
      });
    }
    return components;
  }

  /**
   * Forward to the given acceptance component
   * @param component 
   */
  goToComponent(component: AcceptanceComponent) {
    console.log("goToComponent", component);

    this.router.navigate(['projects', this.project.id, 'acceptanceTests'], { queryParams: { id: component.id } });
  }

}
