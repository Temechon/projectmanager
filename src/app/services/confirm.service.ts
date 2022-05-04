import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { IpcService } from "./ipc.service";

@Injectable({
    providedIn: 'root'
})
export class ConfirmService {

    constructor(private ipcService: IpcService) {

    }

    confirm(question: string, title: string = "Confirm"): boolean {

        const options = {
            type: 'question',
            buttons: ["Oui", "Non"],
            title: title,
            message: question
        };

        let answer = false;
        if (environment.production) {
            let clickedButton = this.ipcService.sendSync('show-dialog', options)
            answer = clickedButton === 0;
        } else {
            answer = window.confirm(question);
        }
        return answer;
    }

}