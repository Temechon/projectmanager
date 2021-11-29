import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateTime } from "luxon";
import { Project } from '../model/project.model';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {

  today: DateTime;

  weeks = [];

  projects = [];

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.today = DateTime.now();

    // Get all days indexed by week
    this._getAllWeeksInMonth();

    // Retrieve all projects from database
    this.db.getProjects().then(projects => {
      this.projects = projects;
      console.log("prod date",);

    });


  }

  /**
   * Returns all days of the given month
   * @returns 
   */
  private _getAllWeeksInMonth() {
    const firstDay = this.today.startOf('month');
    const days = [];
    for (let i = 0; i < firstDay.daysInMonth; i++) {
      days.push(firstDay.plus({ days: i }));
    }
    while (days.length > 0) {
      this.weeks.push(days.splice(0, 7));
    }
  }

  hasDelivery(project: Project, day: DateTime) {
    if (project.prodDate) {
      return project.prodDate.toISODate() === day.toISODate();
    }

    return false;
  }

}
