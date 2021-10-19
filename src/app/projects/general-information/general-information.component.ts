import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Doc } from '@lokidb/indexed-storage/types/common/types';
import { Project } from 'src/app/model/project.model';
import { DatabaseLokiService } from 'src/app/services/database-loki.service';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private db: DatabaseLokiService
  ) { }

  project: Doc<Project>

  ngOnInit(): void {

    this.project = this.route.parent.snapshot.data.project;
    console.log("PROJECT ICI", this.project)
  }

  save() {
    console.log("Saving project", this.project);
    this.db.saveProject(this.project);
  }

}
