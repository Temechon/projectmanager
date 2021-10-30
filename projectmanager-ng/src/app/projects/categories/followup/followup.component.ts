import { Component, OnInit } from '@angular/core';
import { CategoryComponent } from '../../category.component';

@Component({
  selector: 'app-followup',
  templateUrl: './followup.component.html',
  styleUrls: ['./followup.component.scss']
})
export class FollowupComponent extends CategoryComponent {

  ngOnInit(): void {
  }

}
