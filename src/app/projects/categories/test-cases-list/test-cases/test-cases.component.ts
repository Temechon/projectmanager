import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pin } from 'src/app/model/pin.model';
import { guid, Project, TestCase, TestCasesList } from 'src/app/model/project.model';
import { DatabaseService } from 'src/app/services/database.service';
import _ from 'underscore';

@Component({
  selector: 'app-test-cases',
  templateUrl: './test-cases.component.html',
  styleUrls: ['./test-cases.component.scss']
})
export class TestCasesComponent implements OnInit {

  testCases: Array<TestCase> = [];
  testsList: TestCasesList;
  project: Project;

  status = [
    {
      label: "OK",
      data: { color: '#37BA83' }
    },
    {
      label: "KO",
      data: { color: '#F80A50' }
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private db: DatabaseService
  ) {

  }

  ngOnInit(): void {

    // Get project from parent route snapshot
    this.project = this.route.parent.parent.snapshot.data.project as Project;

    // Get test list id from url
    let testsListId = this.route.snapshot.paramMap.get('id');

    // Get test case from project
    this.testsList = this.project.testCasesList.find(tc => tc.id === testsListId)

    this.testCases = this.testsList.testCases;
    this.testCases = _.sortBy(this.testCases, 'index');

  }

  get category(): string {
    return 'test-cases';
  }

  /**
   * Export all incident to excel
   */
  export() {

  }


  save() {
    this.project.testCasesList.find(tc => tc.id === this.testsList.id).testCases = this.testCases;
    this.db.saveProject(this.project.toObject())
  }

  /**
   * Add a test case
   */
  add() {

    // Retrieve data from the last test case
    const lastTestCase = this.testCases[this.testCases.length - 1];

    this.testCases.push({
      id: guid(),
      name: lastTestCase?.name || "",
      category: lastTestCase?.category || "",
      test_date: lastTestCase?.test_date || "",
      expected_result: lastTestCase?.expected_result || "",
      status: "",
      comments: "",
      index: lastTestCase?.index + 1 || 0
    });
    this.save();
  }

  delete(index: number) {
    this.testCases.splice(index, 1);
    this.save();
  }

  toggleOkTests() {

  }

  drop(event: CdkDragDrop<string>) {
    moveItemInArray(this.testCases, event.previousIndex, event.currentIndex);

    this.testCases.forEach((tc: TestCase, index: number) => {
      tc.index = index;
    });

    this.save();
  }

  createPin(): Pin {
    throw new Error('Method not implemented.');
  }

}
