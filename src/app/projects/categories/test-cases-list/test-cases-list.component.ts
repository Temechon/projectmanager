import { Component } from '@angular/core';
import { guid, Pin } from 'src/app/model/project.model';
import { CategoryComponent } from '../../category.component';

@Component({
  selector: 'app-test-cases',
  templateUrl: './test-cases-list.component.html',
  styleUrls: ['./test-cases-list.component.scss']
})
export class TestCasesListComponent extends CategoryComponent {


  ngOnInit(): void {
    super.ngOnInit();

    // Get the project from the parent parent route
    let prr = this.route.parent.parent.snapshot.data;
    this.project = prr.project;


    // IF no test case list, create one and forward 
    if (this.project.testCasesList.length === 0) {
      this.project.testCasesList = [{
        id: guid(),
        version: '1',
        testCases: []
      }];
      this.save();
      this.router.navigate(['/projects', this.project.id, 'testCases', this.project.testCasesList[0].id]);
    }

    // If only one test case list, forward to test case list
    else if (this.project.testCasesList.length === 1) {
      this.router.navigate(['/projects', this.project.id, 'testCases', this.project.testCasesList[0].id]);
    }

    // Otherwise, display the list of test cases.
  }


  get category(): string {
    return 'test-cases-list';
  }

  createPin(): Pin {
    throw new Error('Method not implemented.');
  }
}
