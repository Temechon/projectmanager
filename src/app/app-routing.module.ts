import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralInformationComponent } from './projects/general-information/general-information.component';
import { ProjectComponent } from './projects/project/project.component';
import { ProjectsComponent } from './projects/projects/projects.component';
import { ProjectResolver } from './resolver/projects.resolver';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'projects',
      },

      {
        path: 'projects',
        children: [
          {
            path: '',
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
                    path: '',
                    redirectTo: 'general',
                    pathMatch: 'full',
                  },
                  {
                    path: 'general',
                    component: GeneralInformationComponent,
                  }
                ]
              }

            ]
          },
        ]
      },

      {
        path: '**',
        redirectTo: 'home'
      },
    ]
  }]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
