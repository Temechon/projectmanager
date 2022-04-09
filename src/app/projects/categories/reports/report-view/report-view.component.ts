import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor } from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import StarterKit from '@tiptap/starter-kit';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActionStatus, guid, Project, Report } from 'src/app/model/project.model';
import { DatabaseService } from 'src/app/services/database.service';
import { PinService } from 'src/app/services/pin.service';
import { SearchService } from 'src/app/services/search.service';
import { TaskService } from 'src/app/services/task.service';
import { ToastService } from 'src/app/services/toast.service';
import _ from 'underscore';
import { StyleButtonComponent } from './style-button/style-button.component';
import { DateTime } from "luxon";



@Component({
  selector: 'report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss']
})
export class ReportViewComponent implements OnInit {

  public editor: Editor;

  note: Report;
  project: Project;

  @ViewChild('style')
  style: StyleButtonComponent;

  @ViewChild('title', { static: true })
  title: ElementRef;

  constructor(
    protected db: DatabaseService,
    protected index: SearchService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected pinner: PinService,
    private taskService: TaskService,
    private toaster: ToastService
  ) {

  }

  routesub: Subscription;

  ngOnDestroy() {
    this.routesub?.unsubscribe();
  }

  ngOnInit(): void {

    this.routesub = this.route.data.subscribe(data => {

      let prr = this.route.parent.parent.snapshot.data;
      this.project = prr.project;

      this.note = data.report
      this.editor?.commands.setContent(this.note.content)
    })

    this.editor = new Editor({
      element: document.querySelector('.element') as Element,
      extensions: [
        StarterKit,
        // Task list
        TaskList,
        TaskItem,
        HorizontalRule,
        Highlight.configure({ multicolor: true })
      ],
      autofocus: true,
      editorProps: {
        attributes: {
          class:
            "h-full w-full mb-7 notes focus:outline-none"
        }
      },
      content: this.note?.content,
    })

    // saves the note every 500 ms
    const delay = 500;

    fromEvent(this.editor, 'update').pipe(
      debounceTime(delay)
    ).subscribe((a: any) => {
      this.note.content = this.editor.getHTML();
      this.save();
    });

    fromEvent(this.title.nativeElement, 'keyup').pipe(
      debounceTime(delay)
    ).subscribe(() => {
      this.note.title = this.title.nativeElement.textContent;
      this.placeCaretAtEnd(this.title.nativeElement)
      this.save();
    })

    // Update the style button according to the selected line
    this.editor.on('selectionUpdate', () => {
      // Get the selected line
      let currentNode = this.editor.state.selection.$anchor.parent;

      // If this is heading
      if (currentNode.type.name === "heading") {
        this.style.updateView(currentNode.attrs.level);
      }
      if (currentNode.type.name === "paragraph") {
        this.style.updateView(4);
      }
    })
  }

  toggleHeading(headinglevel: number) {
    this.editor.chain().focus().toggleHeading({ level: headinglevel as any }).run()
  }

  /**
   * Delete a report from the project
   */
  deleteNote() {
    let res = window.confirm("Êtes-vous sûr de vouloir supprimer ce compte-rendu ?");
    if (res) {
      let reportIndex = this.project.reports.findIndex(r => r.id === this.note.id);
      let reports = this.project.reports.splice(reportIndex, 1);

      this.index.removeObject(reports[0].id);
      this.db.saveProject(this.project.toObject());
      this.index.updateProject(this.project);

      this.pinner.unpinReport(reports[0].id);

      this.router.navigate(['projects', this.project.id, 'reports']);

    }
  }

  /**
   * Magical function to set the cursor at the end of the text node
   */
  placeCaretAtEnd(el: any) {
    el.focus();
    if (typeof window.getSelection != "undefined"
      && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }

  /**
   * Create an action in the todo panel with to the selected text and linked to the current project
   */
  createTask() {
    // Retrieve selected text with tiptap editor
    const { state } = this.editor
    const { from, to } = state.selection
    const content = state.doc.textBetween(from, to, ' ')

    if (content) {

      // Create a task
      this.taskService.createTask(this.project.id, this.project.internalid, content);
      this.toaster.toast({
        content: "Une tâche a bien été créée !",
        icon: "fas fa-check-circle",
        type: "success"
      })
    } else {
      this.toaster.toast({
        content: "Sélectionnez du texte pour créer une tâche",
        icon: "fas fa-info-circle",
        type: "info",
        time: 2000
      })
    }
  }

  createAction() {// Retrieve selected text with tiptap editor
    const { state } = this.editor
    const { from, to } = state.selection
    const content = state.doc.textBetween(from, to, ' ')

    if (content) {

      // Create a task
      this.project.actions.push({
        id: guid(),
        name: `CR ${this.note.title} - Action créée`,
        from: '',
        date: DateTime.now().toLocaleString(DateTime.DATE_SHORT),
        status: ActionStatus.OPEN,
        details: content,
        answer: '',
        close_date: '',
        comments: []
      })
      this.toaster.toast({
        content: "Une action a bien été créée !",
        icon: "fas fa-check-circle",
        type: "success"
      })
    } else {
      this.toaster.toast({
        content: "Sélectionnez du texte pour créer une action.",
        icon: "fas fa-info-circle",
        type: "info",
        time: 2000
      })
    }
  }

  save() {

    // Find the same report by its id
    let report = _.find(this.project.reports, r => r.id === this.note.id) as Report;
    report.title = this.note.title;
    report.content = this.note.content;

    this.db.saveProject(this.project.toObject());
    this.index.updateProject(this.project);
  }

}
