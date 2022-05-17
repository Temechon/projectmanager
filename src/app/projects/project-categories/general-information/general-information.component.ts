import { Component } from '@angular/core';
import randomColor from 'randomcolor';
import { CreateSpiraComponent } from 'src/app/gui/dialog/create-spira/create-spira.component';
import { Pin } from 'src/app/model/pin.model';
import { guid, Project } from 'src/app/model/project.model';
import { environment } from 'src/environments/environment';
import { CategoryComponent } from '../../category.component';
import { debounce } from 'underscore';


@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent extends CategoryComponent {


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


  get category(): string {
    return 'general';
  }

  delete() {
    let res = this.confirmService.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?", "Supprimer un projet");
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

  reload() {
    let res = this.confirmService.confirm("Êtes-vous sûr de vouloir recharger ce projet? Toutes les données seront supprimées", "Recharger un projet");
    if (res) {
      this.db.deleteProject(this.project).then(() => {
        // Update index        
        return this.index.removeProject(this.project);
      }).then(() => {

        if (environment.production) {
          // Open file explorer to select the old project file
          let file = this.ipcService.sendSync('open-file-explorer', {
            title: 'Ouvrir un projet',
            filters: [{ name: "Fichier '.project'" }]
          })

          console.log("File selected", file);
          let jsonProject = JSON.parse(file);

          let project = new Project(jsonProject);
          project.reloadIds();

          this.db.saveProject(project).then((newproject) => {
            // Update index
            this.index.addProject(project);
            // Open the project
            setTimeout(() => {
              this.router.navigate(['projects', newproject.id])
            }, 50)
          })


        } else {
          console.log("Not in production");

          openFilePicker().then((file: any) => {
            console.log("File selected", file);
            // Read the given file with a FileRead
            let reader = new FileReader();
            reader.onload = (e) => {
              console.log(e.target.result);
              let jsonProject = JSON.parse(reader.result as string);
              console.log("JSON", jsonProject);

              // Load the project in database
              let project = new Project(jsonProject);
              project.reloadIds();
              this.db.saveProject(project).then((newproject) => {
                // // Update index
                this.index.addProject(project);
                // Open the project
                setTimeout(() => {
                  this.router.navigate(['projects', newproject.id])
                }, 50)
              })

            };
            reader.readAsText(file);
          })
        }
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

  createPin(): Pin {

    return new Pin({
      id: guid(),
      projectid: this.project.id,
      title: 'Infos générales',
      projectinternalid: this.project.internalid,
      category: this.category,
      params: null
    })
  }

  /**
   * Create Spira template
   */
  createTemplate() {

    let dialogref = this.dialog.openDialog(CreateSpiraComponent, {

      button1: {
        text: 'Valider',
        param: 'ok',
      },
      button2: {
        text: 'Annuler',
        param: 'cancel'
      }
    }
    );

    dialogref.onClose.subscribe((data?: any) => {
      if (!data) {
        return;
      }
      let d = {
        internalid: this.project.internalid,
        name: this.project.name,
        ...data
      }
      console.log("ITEM RECU", d);

      this.docx.generateSpiraTemplate(d);
    })
  }
}

/**
 * Run the file explorer and returns the selected file
 * @param options 
 * @returns 
 */
function openFilePicker(options = {}) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.classList.add('opacity-0');
  fileInput.classList.add('absolute');
  fileInput.classList.add('bottom-0');

  Object.keys(options).forEach((attribute) => {
    fileInput.setAttribute(attribute, options[attribute]);
  });

  document.body.appendChild(fileInput);
  fileInput.focus();
  fileInput.click();

  return new Promise((resolve, reject) => {

    function checkFiles(event: any) {
      let input = event.target;

      let files = event.target.files;
      console.log('ici', files);

      if (files.length) {
        resolve(files[0]);
      } else {
        reject(files[0]);
      }

      if (input.parentNode === document.body) {
        document.body.removeChild(input);
      }
    }

    const eventListener = debounce(checkFiles, 200);

    // fileInput.addEventListener('focus', eventListener, { once: true });
    fileInput.addEventListener('change', eventListener, { once: true });
  });
}
