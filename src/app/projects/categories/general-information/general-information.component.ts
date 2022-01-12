import { Component } from '@angular/core';
import randomColor from 'randomcolor';
import { environment } from 'src/environments/environment';
import { CategoryComponent } from '../../category.component';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent extends CategoryComponent {


  status = [
    {
      label: 'En cours',
      data: { color: '#37BA83' }
    },
    {
      label: 'En attente',
      data: { color: '#ffaa00' }
    },
    {
      label: 'Archivé',
      data: { color: '#0095ff' }
    }
  ]


  delete() {
    let res = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (res) {
      this.db.deleteProject(this.project).then(() => {
        // Update index        
        this.index.removeProject(this.project);
        // Forward to the first project
        return this.db.getProjects()
      }).then((projects) => {
        console.log("data ici", projects);
        this.router.navigate(['projects', projects[0].id])
      })
    }
  }

  openFolder(folder: string) {
    if (environment.production) {
      // Use ipc service to open the folder
      this.ipcService.send('open-folder', folder);
    } else {
      console.log("Not in production")
    }
  }

  updateColor() {
    this.project.color = randomColor({ format: 'hex' });
    this.save();
  }

  openLink(link: string) {
    if (environment.production) {
      // Use ipc service to open the link
      this.ipcService.send('open-link', link);
    } else {
      window.open(link, "_blank");
    }
  }
}
