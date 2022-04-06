import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastRef } from 'src/app/model/toast.model';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {

  @Input() data: any;
  toastRef: ToastRef<ToastComponent>;

  @ViewChild('toast') toast: ElementRef;

  constructor() {
  }

  ngAfterViewInit(): void {
    let toast = this.toast.nativeElement;

    // Scroll into view
    setTimeout(() => {
      toast.classList.remove("translate-x-full")
    }, 100)

    setTimeout(() => {
      toast.classList.add("translate-x-full")
    }, 700)

    setTimeout(() => {
      this.close();
    }, 1000)

  }

  close(param?: any) {
    this.toastRef.close(param)
  }

}
