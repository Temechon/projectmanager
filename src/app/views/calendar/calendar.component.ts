import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateTime } from "luxon";
import { Project } from 'src/app/model/project.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {

  status = [
    {
      label: Project.STATUS.running,
      data: { color: '#37BA83' }
    },
    {
      label: Project.STATUS.waiting,
      data: { color: '#ffaa00' }
    },
    {
      label: Project.STATUS.archived,
      data: { color: '#0095ff' }
    }
  ]
  selectedStatus = Project.STATUS.running;

  today: DateTime;

  weeks = [];

  projects = [];

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.today = DateTime.now();

    // Get all days indexed by week
    this._getAllWeeksInMonth();

    this.updateCalendar();

  }

  updateCalendar() {
    // Retrieve all projects from database
    this.db.getProjects().then(projects => {
      this.projects = projects.filter(p => p.status === this.selectedStatus);
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
