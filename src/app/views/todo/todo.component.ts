import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import _ from 'underscore';
import { guid, Project } from '../../model/project.model';
import { Task } from '../../model/task.model';
import { DatabaseService } from '../../services/database.service';
import { SearchService } from '../../services/search.service';
import { DateTime } from "luxon";


export enum TASK_STATUS {
  todo = "todo",
  running = "running",
  done = "done",
  standby = "standby",
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
  standbytasks: Task[] = [];

  filterLabel: string = ""

  projects: Project[] = [];
  options: Array<{ label: string, data: Project }> = [];

  constructor(
    private db: DatabaseService,
    private index: SearchService) { }

  /**
   * It gets all the projects from the database and then gets all the tasks from the database.
   */
  ngOnInit(): void {
    // Build a list with all proects internalid available in database
    this.db.getProjects().then(d => {
      this.projects = d;

      this.options = [];
      this.projects.filter(p => p.status !== Project.STATUS.archived).map(p => {
        this.options.push({ label: p.internalid, data: p });
      })
    }).then(() => {

      return this.db.getTasks();
    }).then(tasks => {
      this._allTasks = tasks;

      this.todotasks = _.sortBy(tasks.filter(t => t.status === TASK_STATUS.todo), 'index');
      this.runningtasks = _.sortBy(tasks.filter(t => t.status === TASK_STATUS.running), 'index');
      this.donetasks = _.sortBy(tasks.filter(t => t.status === TASK_STATUS.done), 'index');
      this.standbytasks = _.sortBy(tasks.filter(t => t.status === TASK_STATUS.standby), 'index');
    });
  }

  /**
   * It adds a new task to the list of tasks.
   * @param {string} status - string
   */
  add(status: string) {
    let t = new Task({
      id: guid(),
      projectid: '',
      projectinternalid: '',
      content: '',
      status: status,
      date: DateTime.local().toFormat('dd LLL yyyy - HH:mm'),
      index: 0
    })
    this.save(t);
    this._allTasks.push(t);

    if (status === 'todo') {
      this.todotasks.unshift(t);
      _.each(this.todotasks, t => t.index++);
      _.each(this.todotasks, this.updateTaskOrder.bind(this));

    }
    if (status === 'running') {
      this.runningtasks.push(t);
    }
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

  /**
   * Delete a task from the database and remove it from the list of all tasks
   * @param {string} taskid - string
   */
  delete(taskid: string) {
    this.db.deleteTask(taskid).then(d => {
      this._allTasks.splice(this._allTasks.findIndex(t => t.id === taskid), 1);

      this.todotasks = _.chain(this._allTasks).filter(t => t.status === TASK_STATUS.todo).sortBy('index').value();
      this.runningtasks = _.chain(this._allTasks).filter(t => t.status === TASK_STATUS.running).sortBy('index').value();
      this.donetasks = _.chain(this._allTasks).filter(t => t.status === TASK_STATUS.done).sortBy('index').value();
      this.standbytasks = _.chain(this._allTasks).filter(t => t.status === TASK_STATUS.standby).sortBy('index').value();

      this.index.removeObject(taskid);
    })
  }

  /**
   * Transfert the given task to the 'done' status
   * @param {string} taskid - string
   */
  done(task: Task) {
    task.status = TASK_STATUS.done;
    this.update(task);

    this.todotasks = _.without(this.todotasks, task);
    this.runningtasks = _.without(this.runningtasks, task);
    this.standbytasks = _.without(this.standbytasks, task);
    this.donetasks.push(task);
    _.each(this.donetasks, t => t.index++);
    _.each(this.donetasks, this.updateTaskOrder.bind(this));
  }


  /**
   * Move the task from the old array to the new array
   * @param event - CdkDragDrop<string>
   */
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
      case TASK_STATUS.standby:
        oldArray = this.standbytasks;
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
      case TASK_STATUS.standby:
        array = this.standbytasks;
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
    this.standbytasks = _.sortBy(this._allTasks.filter(t => t.status === TASK_STATUS.standby), 'index');

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
      this.standbytasks = this.standbytasks.filter(t => t.projectinternalid === label);
    }
  }

}
