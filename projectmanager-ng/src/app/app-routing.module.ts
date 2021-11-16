import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceptanceTestsComponent } from './projects/categories/acceptance-tests/acceptance-tests.component';
import { ActivityComponent } from './projects/categories/activity/activity.component';
import { ActorsComponent } from './projects/categories/actors/actors.component';
import { GeneralInformationComponent } from './projects/categories/general-information/general-information.component';
import { NotesComponent } from './projects/categories/notes/notes.component';
import { ReportsComponent } from './projects/categories/reports/reports.component';
import { ProjectComponent } from './projects/project/project.component';
import { ProjectsComponent } from './projects/projects/projects.component';
import { ProjectResolver } from './resolver/projects.resolver';
import { SearchResultsComponent } from './search-results/search-results.component';
import { TodoComponent } from './todo/todo.component';


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
        path: 'todo',
        component: TodoComponent
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
            path: 'acceptanceTests',
            component: AcceptanceTestsComponent,
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
