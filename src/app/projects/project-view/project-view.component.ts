import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/model/project.model';
import { PinService } from 'src/app/services/pin.service';
import { CategoryComponent } from '../category.component';

@Component({
  selector: 'app-project',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    private pinner: PinService

  ) { }

  project: Project

  categoryComponent: CategoryComponent;


  ngOnInit(): void {
  }

  /**
   * Called when a project category is selected
   * @param componentRef 
   */
  onActivate(componentRef: CategoryComponent) {
    this.categoryComponent = componentRef;
  }

  isPinned() {
    return this.pinner.isPinned();
  }


  /**
   * Adds a pin to the current element
   */
  pin() {
    this.categoryComponent.pinElement();
  }

  /**
   * Adds a pin to the current element
   */
  unpin() {
    this.categoryComponent.unpinElement();
  }

}
