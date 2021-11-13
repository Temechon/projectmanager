import { Component, OnInit } from '@angular/core';
import { guid } from '../model/project.model';
import { Task } from '../model/task.model';
import { DatabaseService } from '../services/database.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  tasks: Task[] = [];

  constructor(
    private db: DatabaseService,
    private index: SearchService) { }

  ngOnInit(): void {

    this.db.getTasks$().subscribe(data => {

      this.tasks = data;
    });
  }

  add() {
    let t = new Task({
      id: guid(),
      projectid: '',
      projectname: '',
      projectinternalid: '1734',
      content: '',
      status: 'todo',
      date: '12/11/2021',
    })
    this.save(t);
  }

  save(task: Task) {
    this.db.saveTask(task).then(d => {
      this.index.addTask(task);
    })
  }

  delete(taskid: string) {
    this.db.deleteTask(taskid).then(d => {
      this.index.removeObject(taskid);
    })
  }
}
