import { Component, ElementRef, EventEmitter, OnInit, ViewChild, Output } from '@angular/core';
import _ from 'underscore';

@Component({
  selector: 'select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})
export class SelectListComponent implements OnInit {

  @ViewChild("list")
  private list: ElementRef;

  options = [
    { label: '1734', data: '' },
    { label: '1631', data: '' },
    { label: '2152', data: '' }
  ];

  selected: number = 0;

  /**
   * Returns the data attribute attached to the selected option
   */
  @Output()
  private onSelected = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  /**
   * Toggles the options panel
   */
  toggleOptions() {
    this.list.nativeElement.classList.toggle('hidden');
  }


  /**
   * Removes the options panel is no style is selected.
   */
  focusout(event: FocusEvent) {
    if ((event.relatedTarget as Element)?.classList.contains("option")) {
      // If the focus is on one option, nothing to do
    } else {
      this.list.nativeElement.classList.add('hidden');
    }
  }


  select(index: number) {
    this.updateView(index);
    this.selected = index;
    console.log(this.selected);
    this.onSelected.emit(this.options[index].data);
  }

  updateView(size: number) {
    this.list.nativeElement.classList.add('hidden');
    // this.styleSelected = this.styles[size - 1];

  }

  isSelected(index: number) {
    return index === this.selected;
  }

}

