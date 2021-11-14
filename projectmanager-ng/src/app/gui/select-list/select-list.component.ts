import { Component, ElementRef, EventEmitter, OnInit, ViewChild, Output, Input } from '@angular/core';
import _ from 'underscore';

@Component({
  selector: 'select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})
export class SelectListComponent implements OnInit {

  @ViewChild("list")
  private list: ElementRef;

  @Input()
  options: Array<{ label: string, data?: any }> = [];

  @Input()
  value: string;
  /**
   * Emits the label attribute of the selected option
   */
  @Output()
  valueChange: EventEmitter<string> = new EventEmitter<string>();

  selected: number = 0;

  /**
   * Returns the data attribute attached to the selected option
   */
  @Output()
  private onSelected = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    // Update selected index according to the given value
    if (this.value) {
      this.selected = _.findIndex(this.options, (option) => option.label === this.value);
    }
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
    this.onSelected.emit(this.options[index].data);
    this.valueChange.emit(this.options[index].label);
  }

  updateView(size: number) {
    this.list.nativeElement.classList.add('hidden');
  }

  isSelected(index: number) {
    return index === this.selected;
  }

}

