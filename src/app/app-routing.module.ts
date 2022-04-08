import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { ProjectlistComponent } from './projectlist/projectlist.component';
import { AcceptanceTestsComponent } from './projects/categories/acceptance/acceptance.component';
import { ActionListComponent } from './projects/categories/action-list/action-list.component';
import { ActionComponent } from './projects/categories/action-list/action/action.component';
import { ActorsComponent } from './projects/categories/actors/actors.component';
import { GeneralInformationComponent } from './projects/categories/general-information/general-information.component';
import { MilestonesComponent } from './projects/categories/milestones/milestones.component';
import { NotesComponent } from './projects/categories/notes/notes.component';
import { ReportViewComponent } from './projects/categories/reports/report-view/report-view.component';
import { ReportsComponent } from './projects/categories/reports/reports.component';
import { TestCasesListComponent } from './projects/categories/test-cases-list/test-cases-list.component';
import { TestCasesComponent } from './projects/categories/test-cases-list/test-cases/test-cases.component';
import { ProjectComponent } from './projects/project/project.component';
import { ProjectsComponent } from './projects/projects/projects.component';
import { ProjectResolver } from './resolver/projects.resolver';
import { ReportResolver } from './resolver/report.resolver';
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
        path: 'calendar',
        component: CalendarComponent
      },
      {
        path: 'projectlist',
        component: ProjectlistComponent
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
            path: 'testCases',
            children: [
              {
                path: '',
                component: TestCasesListComponent,
              },
              {
                path: ':id',
                component: TestCasesComponent,
              }
            ]
          },
          {
            path: 'actions',
            children: [
              {
                path: '',
                component: ActionListComponent,
              },
              {
                path: ':id',
                component: ActionComponent,
              }
            ]
          },
          {
            path: 'reports',
            component: ReportsComponent,
            children: [
              {
                path: ':id',
                resolve: {
                  report: ReportResolver,
                },
                component: ReportViewComponent,
              }
            ]
          },
          {
            path: 'notes',
            component: NotesComponent,
          },
          {
            path: 'milestones',
            component: MilestonesComponent,
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
