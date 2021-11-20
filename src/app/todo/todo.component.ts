import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import _ from 'underscore';
import { guid, Project } from '../model/project.model';
import { Task } from '../model/task.model';
import { DatabaseService } from '../services/database.service';
import { SearchService } from '../services/search.service';
import { DateTime } from "luxon";


export enum TASK_STATUS {
  todo = "todo",
  running = "running",
  done = "done",
  archived = "archived"
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  private _allTasks: Task[] = [];
  todotasks: Task[] = [];
  runningtasks: Task[] = [];
  donetasks: Task[] = [];

  filterLabel: string = ""

  projects: Project[] = [];
  options: Array<{ label: string, data: Project }> = [];

  constructor(
    private db: DatabaseService,
    private index: SearchService) { }

  ngOnInit(): void {
    // Build a list with all proects internalid available in database
    this.db.getProjects().then(d => {
      this.projects = d;

      this.options = [];
      this.projects.map(p => {
        this.options.push({ label: p.internalid, data: p });
      })
    }).then(() => {

      this.db.getTasks$().subscribe(tasks => {
        this._allTasks = tasks;

        this.todotasks = _.sortBy(tasks.filter(t => t.status === TASK_STATUS.todo), 'index');
        this.runningtasks = _.sortBy(tasks.filter(t => t.status === TASK_STATUS.running), 'index');
        this.donetasks = _.sortBy(tasks.filter(t => t.status === TASK_STATUS.done), 'index');
      });
    })
  }

  add(status: string) {
    let t = new Task({
      id: guid(),
      projectid: '',
      projectinternalid: '',
      content: '',
      status: status,
      date: DateTime.local().toFormat('dd LLL yyyy - HH:mm'),
      index: this.todotasks.length + 1
    })
    this.save(t)
  }

  linkTaskToProjectid(t: Task, $event: Project) {
    t.projectid = $event.id;
    this.update(t)
  }

  save(task: Task) {
    this.db.saveTask(task).then(d => {
      this.index.addTask(task);
    })
  }
  update(task: Task) {
    this.db.saveTask(task).then(d => {
      this.index.updateTask(task);
    })
  }

  delete(taskid: string) {
    this.db.deleteTask(taskid).then(d => {
      this.index.removeObject(taskid);
    })
  }


  drop(event: CdkDragDrop<string>) {
    const task = event.item.data as Task;
    const oldStatus = event.previousContainer.data as TASK_STATUS;
    const status = event.container.data as TASK_STATUS;

    let oldArray;
    let array;
    switch (oldStatus) {
      case TASK_STATUS.todo:
        oldArray = this.todotasks;
        break;
      case TASK_STATUS.running:
        oldArray = this.runningtasks;
        break;
      case TASK_STATUS.done:
        oldArray = this.donetasks;
        break;
    }
    switch (status) {
      case TASK_STATUS.todo:
        array = this.todotasks;
        break;
      case TASK_STATUS.running:
        array = this.runningtasks;
        break;
      case TASK_STATUS.done:
        array = this.donetasks;
        break;
    }

    task.status = status;
    task.index = event.currentIndex;

    transferArrayItem(oldArray, array, event.previousIndex, event.currentIndex);

    _.each(array, this.updateTaskOrder.bind(this));

    if (oldArray !== array) {
      _.each(oldArray, this.updateTaskOrder.bind(this));
    }
  }

  private updateTaskOrder(task, index) {
    task.index = index;
    this.update(task)
  }

  /**
   * Filter task by project
   * @param label 
   */
  toggleFilter($event, label: string) {
    // remove class 'bg-secondary' from all options
    document.querySelectorAll('.filter').forEach(e => {
      e.classList.remove('active');
    })


    // reset filter
    this.todotasks = _.sortBy(this._allTasks.filter(t => t.status === TASK_STATUS.todo), 'index');
    this.runningtasks = _.sortBy(this._allTasks.filter(t => t.status === TASK_STATUS.running), 'index');
    this.donetasks = _.sortBy(this._allTasks.filter(t => t.status === TASK_STATUS.done), 'index');

    // If the given label is already selected, remove it
    if (this.filterLabel === label) {
      this.filterLabel = "";

    } else {
      // add class 'bg-secondary' to the selected option
      $event.target.classList.add('active');

      this.filterLabel = label;
      this.todotasks = this.todotasks.filter(t => t.projectinternalid === label);
      this.runningtasks = this.runningtasks.filter(t => t.projectinternalid === label);
      this.donetasks = this.donetasks.filter(t => t.projectinternalid === label);
    }
  }

}
