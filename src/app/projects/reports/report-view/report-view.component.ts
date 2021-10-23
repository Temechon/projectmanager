import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Editor } from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import StarterKit from '@tiptap/starter-kit';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Report } from 'src/app/model/project.model';
import { StyleButtonComponent } from './style-button/style-button.component';



@Component({
  selector: 'report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss']
})
export class ReportViewComponent implements OnInit, OnChanges {

  public editor: Editor;

  @Input()
  note: Report;

  @Output()
  onDelete: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('style')
  style: StyleButtonComponent;

  @ViewChild('title', { static: true })
  title: ElementRef;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log("cc", changes.note.currentValue);
    this.note = changes.note.currentValue;
    this.editor?.commands.setContent(this.note.content)
  }

  ngOnInit(): void {

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
      console.log('saving')
      this.note.content = this.editor.getHTML();
      // this.noteService.save(this.note)
    });

    fromEvent(this.title.nativeElement, 'keyup').pipe(
      debounceTime(delay)
    ).subscribe(() => {
      this.note.title = this.title.nativeElement.textContent;
      this.placeCaretAtEnd(this.title.nativeElement)
      // this.noteService.save(this.note);
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

  // addTag($event: any) {
  //   const tag = $event.target.value;
  //   if (_.contains(this.note.tags, tag)) {
  //     return;
  //   }

  //   this.note.tags.push($event.target.value);
  //   $event.target.value = "";
  //   // this.noteService.save(this.note);
  // }
  // removeTag(tag: string) {
  //   this.note.tags = _.without(this.note.tags, tag)
  //   // this.noteService.save(this.note);
  // }

  deleteNote() {
    let res = window.confirm("Êtes-vous sûr de vouloir supprimer ce compte-rendu ?");
    if (res) {
      this.onDelete.emit();
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

}
