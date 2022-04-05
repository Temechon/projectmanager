import { Injectable } from '@angular/core';
import { guid } from '../model/project.model';
import { Task } from '../model/task.model';
import { TASK_STATUS } from '../todo/todo.component';
import { DatabaseService } from './database.service';
import { SearchService } from './search.service';
import { DateTime } from "luxon";


@Injectable({
    providedIn: 'root'
})
export class TaskService {

    constructor(
        private db: DatabaseService,
        private index: SearchService
    ) {

    }

    createTask(projectid: string, projectinternalid: string, content: string) {
        let task = new Task({
            id: guid(),
            projectid: projectid,
            projectinternalid: projectinternalid,
            content: content,
            status: TASK_STATUS.todo,
            date: DateTime.local().toFormat('dd LLL yyyy - HH:mm'),
            index: 0
        })
        this.save(task);
    }


    save(task: Task) {
        this.db.saveTask(task).then(d => {
            this.index.addTask(task);
        })
    }

}
