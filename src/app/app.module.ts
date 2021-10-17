import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatabaseLokiService, initDatabase } from './services/database-loki.service';
import { ProjectsComponent } from './projects/projects/projects.component';
import { ProjectComponent } from './projects/project/project.component';
import { GeneralInformationComponent } from './projects/general-information/general-information.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    ProjectComponent,
    GeneralInformationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => initDatabase,
      multi: true,
      deps: []
    },
    DatabaseLokiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
