import { Component, OnInit } from '@angular/core';
import { CategoryComponent } from 'src/app/projects/category.component';

@Component({
  selector: 'app-test-cases',
  templateUrl: './test-cases.component.html',
  styleUrls: ['./test-cases.component.scss']
})
export class TestCasesComponent extends CategoryComponent {


  ngOnInit(): void {
    super.ngOnInit();


  }

  /**
   * Export all incident to excel
   */
  export() {

  }

  /**
   * Add a test case
   */
  add() {

  }

}
