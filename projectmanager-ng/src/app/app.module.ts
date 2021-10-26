import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GuiModule } from './gui/gui.module';
import { ActorsComponent } from './projects/categories/actors/actors.component';
import { FollowupComponent } from './projects/categories/followup/followup.component';
import { GeneralInformationComponent } from './projects/categories/general-information/general-information.component';
import { ReportViewComponent } from './projects/categories/reports/report-view/report-view.component';
import { StyleButtonComponent } from './projects/categories/reports/report-view/style-button/style-button.component';
import { ReportsComponent } from './projects/categories/reports/reports.component';
import { ProjectComponent } from './projects/project/project.component';
import { ProjectsComponent } from './projects/projects/projects.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { DatabaseService, initDatabase } from './services/database.service';
import { SearchService } from './services/search.service';


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
    FollowupComponent,
    SearchResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuiModule
  ],
  providers: [
    SearchService,
    {
      provide: APP_INITIALIZER,
      useFactory: (s: SearchService) => () => initDatabase(s),
      multi: true,
      deps: [SearchService]
    },
    DatabaseService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
