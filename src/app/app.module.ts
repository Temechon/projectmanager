import { DragDropModule } from '@angular/cdk/drag-drop';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GuiModule } from './gui/gui.module';
import { ProjectlistComponent } from './views/projects-list/projectlist.component';
import { ProjectViewComponent } from './projects/project-view/project-view.component';
import { MainViewComponent } from './projects/main-view/main-view.component';
import { SearchResultsComponent } from './views/search-results/search-results.component';
import { DatabaseService, initDatabase } from './services/database.service';
import { IpcService } from './services/ipc.service';
import { SearchService } from './services/search.service';
import { SyncService } from './services/sync.service';
import { CalendarComponent } from './views/calendar/calendar.component';
import { ProjectInfoComponent } from './views/calendar/project-info/project-info.component';
import { TodoComponent } from './views/todo/todo.component';
import { ActionsListComponent } from './views/actions-list/actions-list.component';
import { AcceptanceTestsComponent } from './projects/project-categories/acceptance/acceptance.component';
import { ActionsComponent } from './projects/project-categories/actions/actions.component';
import { ActionComponent } from './projects/project-categories/actions/action/action.component';
import { ActorsComponent } from './projects/project-categories/actors/actors.component';
import { GeneralInformationComponent } from './projects/project-categories/general-information/general-information.component';
import { MilestonesComponent } from './projects/project-categories/milestones/milestones.component';
import { NotesComponent } from './projects/project-categories/notes/notes.component';
import { ReportViewComponent } from './projects/project-categories/reports/report-view/report-view.component';
import { StyleButtonComponent } from './projects/project-categories/reports/report-view/style-button/style-button.component';
import { ReportsComponent } from './projects/project-categories/reports/reports.component';
import { TestCasesListComponent } from './projects/project-categories/test-cases-list/test-cases-list.component';
import { TestCasesComponent } from './projects/project-categories/test-cases-list/test-cases/test-cases.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateSpiraComponent } from './gui/dialog/create-spira/create-spira.component';
import { DialogComponent } from './gui/dialog/dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    ProjectViewComponent,
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
    ActionsComponent,
    ActionComponent,
    ActionsListComponent,
    CreateSpiraComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    GuiModule,
    DragDropModule,
    NgxTippyModule,
    NgScrollbarModule,
    HttpClientModule,
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
