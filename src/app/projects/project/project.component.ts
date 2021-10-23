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

    // console.log("COUCOU PROJECT HERE");


    this.routesub = this.route.data.subscribe(data => {
      let path = localStorage.getItem('PM_PROJECT_PATH');
      if (path) {
        console.log("FORWARD", path, data.project);
        this.router.navigate(['projects', data.project.id, path])
      }
    })
  }

  ngOnDestroy() {
    this.routesub.unsubscribe();
  }

}
