import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectlistComponent } from './views/projects-list/projectlist.component';
import { ProjectViewComponent } from './projects/project-view/project-view.component';
import { MainViewComponent } from './projects/main-view/main-view.component';
import { ProjectResolver } from './resolver/projects.resolver';
import { ReportResolver } from './resolver/report.resolver';
import { SearchResultsComponent } from './views/search-results/search-results.component';
import { CalendarComponent } from './views/calendar/calendar.component';
import { TodoComponent } from './views/todo/todo.component';
import { AcceptanceTestsComponent } from './projects/project-categories/acceptance/acceptance.component';
import { ActionsComponent } from './projects/project-categories/actions/actions.component';
import { ActionComponent } from './projects/project-categories/actions/action/action.component';
import { ActorsComponent } from './projects/project-categories/actors/actors.component';
import { GeneralInformationComponent } from './projects/project-categories/general-information/general-information.component';
import { MilestonesComponent } from './projects/project-categories/milestones/milestones.component';
import { NotesComponent } from './projects/project-categories/notes/notes.component';
import { ReportViewComponent } from './projects/project-categories/reports/report-view/report-view.component';
import { ReportsComponent } from './projects/project-categories/reports/reports.component';
import { TestCasesListComponent } from './projects/project-categories/test-cases-list/test-cases-list.component';
import { TestCasesComponent } from './projects/project-categories/test-cases-list/test-cases/test-cases.component';
import { ActionsListComponent } from './views/actions-list/actions-list.component';


const routes: Routes = [
  {
    path: 'projects',
    component: MainViewComponent,
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
        path: 'actionlist',
        component: ActionsListComponent
      },
      {
        path: ':id',
        resolve: {
          project: ProjectResolver,
        },
        component: ProjectViewComponent,
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
                component: ActionsComponent,
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
