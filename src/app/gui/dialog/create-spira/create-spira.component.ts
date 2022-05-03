import { Component, Input } from '@angular/core';
import { DialogComponent } from '../dialog.component';
import { DateTime } from "luxon";

@Component({
  selector: 'app-create-spira',
  templateUrl: './create-spira.component.html',
  styleUrls: ['./create-spira.component.scss']
})
export class CreateSpiraComponent extends DialogComponent {

  @Input()
  data: any;

  teams = [
    {
      label: "OUTILS DE LA RELATION CLIENT - Outils transverses",
      data: { color: '#3366FF' }
    },
    {
      label: "OUTILS DE LA RELATION CLIENT - Outils hors flux",
      data: { color: '#37BA83' }
    }
  ];

  infos = {
    author: '',
    authorteam: '',
    trigram: '',
    targetdate: '',
    targetvp: '',
  }

  ngOnInit() {
    this.infos.targetdate = DateTime.local().plus({ days: 1 }).toFormat('dd-MM-yyyy');
  }

  close() {
    super.close()
  }

  closeAndCreate() {
    // remove all items where checked is false    
    super.close(this.infos);
  }

  updateTrigram() {
    // Get author first name
    let firstletter = this.infos.author.split(' ')[0][0].toUpperCase();
    let secondthirdletters = this.infos.author.split(' ')[1][0].toUpperCase() + this.infos.author.split(' ')[1][1].toUpperCase();

    this.infos.trigram = `${firstletter}${secondthirdletters}`;
  }
}
