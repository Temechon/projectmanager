import { Component, Input, OnInit } from '@angular/core';
import { ToastRef } from 'src/app/model/toast.model';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  @Input() data: any;
  toastRef: ToastRef<ToastComponent>;

  constructor() {
  }

  ngOnInit(): void {
  }

  close(param: any) {
    this.toastRef.close(param)
  }

}
