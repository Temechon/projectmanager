import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'style-button',
  templateUrl: './style-button.component.html',
  styleUrls: ['./style-button.component.scss']
})
export class StyleButtonComponent implements OnInit {

  @ViewChild("options")
  private options: ElementRef;

  @Output()
  private onStyleSelected = new EventEmitter();


  private styles = ["Titre 1", "Titre 2", "Titre 3", "Paragraphe"];

  public styleSelected = this.styles[0];

  constructor() { }


  ngOnInit(): void {

  }

  /**
   * Toggles the options panel
   */
  toggleOptions() {
    this.options.nativeElement.classList.toggle('hidden');
  }


  /**
   * Removes the options panel is no style is selected.
   */
  focusout(event: FocusEvent) {
    if ((event.relatedTarget as Element)?.className === "option") {
      // If the focus is on one option, nothing to do
    } else {
      this.options.nativeElement.classList.add('hidden');
    }
  }


  select(size: number) {
    this.updateView(size);
    this.onStyleSelected.emit(size);
  }

  updateView(size: number) {
    this.options.nativeElement.classList.add('hidden');
    this.styleSelected = this.styles[size - 1];

  }

  isSelected(size: number) {
    return this.styleSelected === this.styles[size - 1];
  }



}
