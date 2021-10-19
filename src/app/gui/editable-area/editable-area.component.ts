import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'editable-area',
  templateUrl: './editable-area.component.html',
  styleUrls: ['./editable-area.component.scss']
})
export class EditableAreaComponent implements OnInit, OnDestroy {

  constructor() { }

  @Input()
  text: string;
  @Output()
  textChange: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  custom: string;

  @Input()
  placeholder: string = "";

  @Output() onFinished: EventEmitter<any> = new EventEmitter();

  saveSub = new Subject<void>();

  ngOnInit(): void {
    this.saveSub.pipe(debounceTime(500)).subscribe(() => {
      this.onFinished.emit();
    })
  }

  onChange($event: Event) {
    this.textChange.emit(this.text)
    this.saveSub.next();
  }

  ngOnDestroy() {
    this.saveSub.complete();
    this.saveSub.unsubscribe();
  }


}
