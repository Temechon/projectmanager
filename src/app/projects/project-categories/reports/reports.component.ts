import { Component } from '@angular/core';
import { DateTime } from "luxon";
import { Subscription } from 'rxjs';
import { Pin } from 'src/app/model/pin.model';
import { guid } from 'src/app/model/project.model';
import { CategoryComponent } from '../../category.component';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends CategoryComponent {


  ngOnInit(): void {
    super.ngOnInit();

    // Get the project from the parent parent route
    let prr = this.route.parent.parent.snapshot.data;
    this.project = prr.project;
  }

  delete(index: number, $event: any) {
    $event.stopPropagation();
    let res = this.confirmService.confirm('Êtes vous sûr de vouloir supprimer ce CR ?', "Supprimer le compte rendu");
    if (res) {
      let reports = this.project.reports.splice(index, 1);

      this.index.removeObject(reports[0].id);
      this.db.saveProject(this.project.toObject());
      this.index.updateProject(this.project);
      this.pinner.unpinReport(reports[0].id);

      this.toaster.toast({
        type: 'success',
        icon: 'fas fa-check',
        content: "Le compte rendu a bien été supprimé !"
      })
      this.save();
    }
  }



  get category(): string {
    return 'reports';
  }

  goToReport(reportid: string) {
    this.router.navigate(['projects', this.project.id, 'reports', reportid]);

  }

  add() {
    let note = {
      id: guid(),
      title: 'Titre',
      content: '',
      date: DateTime.now().toLocaleString(DateTime.DATE_SHORT)
    };
    this.project.reports.push(note);
    this.save().then(() => {
      this.goToReport(note.id)
    });
  }

  createPin(): Pin {
    // Get the current report
    let report = this.project.reports.find(report => report.id === this.router.url.split('/').pop().trim());
    return new Pin({
      id: guid(),
      projectid: this.project.id,
      title: report.title,
      projectinternalid: this.project.internalid,
      category: this.category,
      params: report.id
    })
  }
}

