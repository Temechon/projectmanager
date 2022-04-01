import { Component, OnInit } from '@angular/core';
import { Pin } from 'src/app/model/project.model';
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

  get category(): string {
    return 'test-cases';
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


  createPin(): Pin {
    throw new Error('Method not implemented.');
  }

}
