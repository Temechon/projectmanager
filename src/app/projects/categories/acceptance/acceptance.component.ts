import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pin } from 'src/app/model/pin.model';
import { guid } from 'src/app/model/project.model';
import { environment } from 'src/environments/environment';
import _ from 'underscore';
import { CategoryComponent } from '../../category.component';

@Component({
  selector: 'app-acceptance',
  templateUrl: './acceptance.component.html',
  styleUrls: ['./acceptance.component.scss']
})
export class AcceptanceTestsComponent extends CategoryComponent {

  status = [
    {
      label: 'Ouvert',
      data: { color: '#ff3d71' }
    },
    {
      label: 'Corrigé en INT',
      data: { color: '#ffaa00' }
    },
    {
      label: 'Corrigé en RCT',
      data: { color: '#0095ff' }
    },
    {
      label: 'Fermé',
      data: { color: '#37BA83' }
    }
  ]

  sub: Subscription;
  selectedindex: number;


  get category(): string {
    return 'acceptance';
  }

  ngOnInit() {
    super.ngOnInit();

    this.sub = this.route.queryParams.subscribe((data) => {
      let componentid = data.id;
      if (componentid) {
        // Select this component
        this.selectedindex = _.findIndex(this.project.acceptanceComponents, p => p.id === componentid);
      }
    })

  }

  add() {
    this.project.incidents.push({
      id: "",
      detail: "",
      comment: "",
      status: this.status[0].label
    });
    this.save();
  }

  addComponent() {
    this.project.acceptanceComponents.push({
      id: guid(),
      title: "",
      integration_date: "",
      recette_date: "",
    });
    this.save();
  }

  deleteComponent(index: number) {
    this.project.acceptanceComponents.splice(index, 1);
    this.save();
  }

  delete(index: number) {
    this.project.incidents.splice(index, 1);
    this.save();
  }
  goToSpira(index: number) {
    let incident = this.project.incidents[index].id;
    let link = `http://intraspiraprd.matmut.fr/SpiraTest/${this.project.spira_projectid}/Incident/${incident}.aspx`;
    if (environment.production) {
      // Use ipc service to open the link
      this.ipcService.send('open-link', link);
    } else {
      window.open(link, "_blank");
    }
  }

  /**
   * Copy all incidents into clipboard
   */
  copyAll() {
    let str = "";
    for (let incident of this.project.incidents) {
      str += `${incident.id} : ${incident.detail} - ${incident.status}`

      if (incident.comment) {
        str += ` (${incident.comment})\n`
      } else {
        str += "\n"
      }
      navigator.clipboard.writeText(str);
    }
  }

  switchTab($event: any, tabname: HTMLDivElement) {
    //hide all tabcontent but the one given in parameter
    let tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].classList.add('hidden')
    }
    tabname.classList.remove('hidden');

    // Remove active class on all tab
    let tablinks = document.getElementsByClassName("tab");
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove("bg-darker");
      tablinks[i].classList.remove("text-white");
      tablinks[i].classList.remove("text-darker");
    }

    // set the selected tab as active
    $event.currentTarget.classList.add('bg-darker');
    $event.currentTarget.classList.add('text-white');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  createPin(): Pin {
    throw new Error('Method not implemented.');
  }

}
