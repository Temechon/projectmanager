import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import _ from 'underscore';
import { guid, Project } from '../model/project.model';
import { Task } from '../model/task.model';
import { DatabaseService } from '../services/database.service';
import { SearchService } from '../services/search.service';


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

  todotasks: Task[] = [];
  runningtasks: Task[] = [];
  donetasks: Task[] = [];

  test: string = "coucou"

  projects: Project[] = [];
  options: Array<{ label: string, data: string }> = [];

  constructor(
    private db: DatabaseService,
    private index: SearchService) { }

  ngOnInit(): void {
    // Build a list with all proects internalid available in database
    this.db.getProjects().then(d => {
      this.projects = d;

      this.options = [];
      this.projects.map(p => {
        this.options.push({ label: p.internalid, data: p.id });
      })
    });

    this.db.getTasks$().subscribe(tasks => {

      this.todotasks = _.sortBy(tasks.filter(t => t.status === TASK_STATUS.todo), 'index');
      this.runningtasks = _.sortBy(tasks.filter(t => t.status === TASK_STATUS.running), 'index');
      this.donetasks = _.sortBy(tasks.filter(t => t.status === TASK_STATUS.done), 'index');
    });
  }

  add(status: string) {
    let t = new Task({
      id: guid(),
      projectid: '',
      projectinternalid: '1734',
      content: '',
      status: status,
      date: '12/11/2021',
      index: this.todotasks.length + 1
    })
    this.save(t)
  }

  linkTaskToProjectid(t: Task, $event: string) {
    t.projectid = $event;
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

}
