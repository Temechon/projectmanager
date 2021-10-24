import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActorsComponent } from './projects/categories/actors/actors.component';
import { GeneralInformationComponent } from './projects/categories/general-information/general-information.component';
import { ProjectComponent } from './projects/project/project.component';
import { ProjectsComponent } from './projects/projects/projects.component';
import { ReportsComponent } from './projects/categories/reports/reports.component';
import { ProjectResolver } from './resolver/projects.resolver';


const routes: Routes = [
  {
    path: 'projects',
    component: ProjectsComponent,
    children: [
      {
        path: ':id',
        resolve: {
          project: ProjectResolver,
        },
        component: ProjectComponent,
        children: [
          {
            path: 'general',
            component: GeneralInformationComponent,
          },
          {
            path: 'actors',
            component: ActorsComponent,
          },
          {
            path: 'reports',
            component: ReportsComponent,
          },
          {
            path: '',
            redirectTo: 'general',
            pathMatch: 'full',
          },
        ]
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'projects'
  },
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
