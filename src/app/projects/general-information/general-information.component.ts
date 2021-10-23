import { Component } from '@angular/core';
import { CategoryComponent } from '../category.component';


@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent extends CategoryComponent {

  delete() {
    let res = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (res) {
      this.db.deleteProject(this.project).then(() => {
        // Forward to the first project
        return this.db.getProjects()
      }).then((projects) => {
        console.log("data ici", projects);
        this.router.navigate(['projects', projects[0].id])
      })
    }
  }
}
