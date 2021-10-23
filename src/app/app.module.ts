import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatabaseLokiService, initDatabase } from './services/database-loki.service';
import { ProjectsComponent } from './projects/projects/projects.component';
import { ProjectComponent } from './projects/project/project.component';
import { GeneralInformationComponent } from './projects/general-information/general-information.component';
import { GuiModule } from './gui/gui.module';
import { ActorsComponent } from './projects/actors/actors.component';
import { ReportsComponent } from './projects/reports/reports.component';
import { ReportViewComponent } from './projects/reports/report-view/report-view.component';
import { StyleButtonComponent } from './projects/reports/report-view/style-button/style-button.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    ProjectComponent,
    GeneralInformationComponent,
    ActorsComponent,
    ReportsComponent,
    ReportViewComponent,
    StyleButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuiModule
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
