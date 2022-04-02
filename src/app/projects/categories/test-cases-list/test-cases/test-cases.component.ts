import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pin } from 'src/app/model/pin.model';
import { guid, Project, TestCase } from 'src/app/model/project.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-test-cases',
  templateUrl: './test-cases.component.html',
  styleUrls: ['./test-cases.component.scss']
})
export class TestCasesComponent implements OnInit {

  testCases: Array<TestCase> = [];
  testsListId: string;
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
    this.testsListId = this.route.snapshot.paramMap.get('id');

    // Get test case from project
    this.testCases = this.project.testCasesList.find(tc => tc.id === this.testsListId).testCases;

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
      comments: ""
    });
  }

  toggleOkTests() {

  }

  createPin(): Pin {
    throw new Error('Method not implemented.');
  }

}
