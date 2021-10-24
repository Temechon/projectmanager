import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatabaseLokiService, initDatabase } from './services/database-loki.service';
import { ProjectsComponent } from './projects/projects/projects.component';
import { ProjectComponent } from './projects/project/project.component';
import { GeneralInformationComponent } from './projects/categories/general-information/general-information.component';
import { GuiModule } from './gui/gui.module';
import { ActorsComponent } from './projects/categories/actors/actors.component';
import { ReportsComponent } from './projects/categories/reports/reports.component';
import { ReportViewComponent } from './projects/categories/reports/report-view/report-view.component';
import { StyleButtonComponent } from './projects/categories/reports/report-view/style-button/style-button.component';
import { FollowupComponent } from './projects/categories/followup/followup.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    ProjectComponent,
    GeneralInformationComponent,
    ActorsComponent,
    ReportsComponent,
    ReportViewComponent,
    StyleButtonComponent,
    FollowupComponent
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
