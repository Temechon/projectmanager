import { DragDropModule } from '@angular/cdk/drag-drop';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ProjectInfoComponent } from './calendar/project-info/project-info.component';
import { GuiModule } from './gui/gui.module';
import { ProjectlistComponent } from './projectlist/projectlist.component';
import { AcceptanceTestsComponent } from './projects/categories/acceptance/acceptance.component';
import { ActionListComponent } from './projects/categories/action-list/action-list.component';
import { ActionComponent } from './projects/categories/action-list/action/action.component';
import { ActorsComponent } from './projects/categories/actors/actors.component';
import { GeneralInformationComponent } from './projects/categories/general-information/general-information.component';
import { MilestonesComponent } from './projects/categories/milestones/milestones.component';
import { NotesComponent } from './projects/categories/notes/notes.component';
import { ReportViewComponent } from './projects/categories/reports/report-view/report-view.component';
import { StyleButtonComponent } from './projects/categories/reports/report-view/style-button/style-button.component';
import { ReportsComponent } from './projects/categories/reports/reports.component';
import { TestCasesListComponent } from './projects/categories/test-cases-list/test-cases-list.component';
import { TestCasesComponent } from './projects/categories/test-cases-list/test-cases/test-cases.component';
import { ProjectComponent } from './projects/project/project.component';
import { ProjectsComponent } from './projects/projects/projects.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { DatabaseService, initDatabase } from './services/database.service';
import { IpcService } from './services/ipc.service';
import { SearchService } from './services/search.service';
import { SyncService } from './services/sync.service';
import { TodoComponent } from './todo/todo.component';



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
    SearchResultsComponent,
    NotesComponent,
    TodoComponent,
    AcceptanceTestsComponent,
    CalendarComponent,
    ProjectInfoComponent,
    MilestonesComponent,
    ProjectlistComponent,
    TestCasesListComponent,
    TestCasesComponent,
    ActionListComponent,
    ActionComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    GuiModule,
    DragDropModule,
    NgxTippyModule,
    NgScrollbarModule
  ],
  providers: [
    SearchService,
    IpcService,
    {
      provide: APP_INITIALIZER,
      useFactory: (s: SearchService, ipc: IpcService, sync: SyncService) => () => initDatabase(s, ipc, sync),
      multi: true,
      deps: [SearchService, IpcService, SyncService]
    },
    DatabaseService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
