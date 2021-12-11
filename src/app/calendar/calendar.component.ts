import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateTime } from "luxon";
import { getDateFromString, Project } from '../model/project.model';
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
      console.log("prod date", projects);

    });
  }

  nextMonth() {
    this.today = this.today.plus({ months: 1 });
    this.weeks = [];
    this._getAllWeeksInMonth();
  }
  previousMonth() {
    this.today = this.today.minus({ months: 1 });
    this.weeks = [];
    this._getAllWeeksInMonth();
  }

  /**
   * Returns all days of the given month
   * @returns 
   */
  private _getAllWeeksInMonth() {
    const firstDay = this.today.startOf('month');
    // Get all days from the first day of the month to the last day of the month
    const days = [];
    for (let i = 0; i < firstDay.daysInMonth; i++) {
      days.push(firstDay.plus({ days: i }));
    }

    // Order days by week
    let weeks = [];
    this.weeks = [];

    let currentweeknumber = days[0].weekNumber;
    let weekindex = 0;
    for (let d of days) {
      if (d.weekNumber !== currentweeknumber) {
        currentweeknumber = d.weekNumber;
        weekindex++;
      }
      if (!weeks[weekindex]) {
        weeks[weekindex] = [];
      }
      weeks[weekindex].push(d);
    }
    this.weeks = weeks;


  }


  isWeekend(day: DateTime) {
    return day.weekday === 6 || day.weekday === 7
  }

  isToday(day: DateTime) {
    return day.toISODate() === DateTime.local().toISODate();
  }

}
