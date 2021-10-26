import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit {

  constructor() { }


  @Input()
  text: string;

  @Input()
  icon: string;

  @Input()
  custom: string;

  @Output()
  private onClick = new EventEmitter();

  ngOnInit(): void {
  }

  emit() {
    this.onClick.emit();
  }

}
