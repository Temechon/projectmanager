import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  constructor(
    protected route: ActivatedRoute,
    private router: Router) { }

  routesub: Subscription;

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

}
