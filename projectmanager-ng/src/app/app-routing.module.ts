import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActorsComponent } from './projects/categories/actors/actors.component';
import { GeneralInformationComponent } from './projects/categories/general-information/general-information.component';
import { ProjectComponent } from './projects/project/project.component';
import { ProjectsComponent } from './projects/projects/projects.component';
import { ReportsComponent } from './projects/categories/reports/reports.component';
import { ProjectResolver } from './resolver/projects.resolver';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ActivityComponent } from './projects/categories/activity/activity.component';
import { NotesComponent } from './projects/categories/notes/notes.component';
import { AcceptanceComponent } from './projects/categories/acceptance/acceptance.component';


const routes: Routes = [
  {
    path: 'projects',
    component: ProjectsComponent,
    children: [
      {
        path: 'search',
        component: SearchResultsComponent
      },
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
            path: 'activities',
            component: ActivityComponent,
          },
          {
            path: 'acceptance',
            component: AcceptanceComponent,
          },
          {
            path: 'notes',
            component: NotesComponent,
          },
          {
            path: '',
            redirectTo: 'general',
            pathMatch: 'full',
          }
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
