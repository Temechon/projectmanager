import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Pin } from 'src/app/model/pin.model';
import { guid, Project, TestCase, TestCasesList } from 'src/app/model/project.model';
import { CategoryComponent } from 'src/app/projects/category.component';
import { DatabaseService } from 'src/app/services/database.service';
import { ExcelService } from 'src/app/services/excel.service';
import _ from 'underscore';

@Component({
  selector: 'app-test-cases',
  templateUrl: './test-cases.component.html',
  styleUrls: ['./test-cases.component.scss']
})
export class TestCasesComponent extends CategoryComponent {

  testCases: Array<TestCase> = [];
  testsList: TestCasesList;
  project: Project;
  testCaseSub: Subscription;

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


  ngOnInit(): void {

    super.ngOnInit();

    this.testCaseSub = this.route.params.subscribe(params => {

      // Get project from parent route snapshot
      this.project = this.route.parent.parent.snapshot.data.project as Project;

      // Get test list id from url
      let testsListId = this.route.snapshot.paramMap.get('id');

      // Get test case from project
      this.testsList = this.project.testCasesList.find(tc => tc.id === testsListId)

      this.testCases = this.testsList.testCases;
      this.testCases = _.sortBy(this.testCases, 'index');

    });
  }

  ngOnDestroy() {
    this.testCaseSub?.unsubscribe();
  }

  get category(): string {
    return 'testCases';
  }

  /**
   * Export all incident to excel
   */
  export() {
    let rows = this.testCases.map(tc => {
      return {
        "Categorie": tc.category,
        "Nom": tc.name,
        "Date": tc.test_date,
        "Résultat attendu": tc.expected_result,
        "Statut": tc.status,
        "Commentaires": tc.comments
      }
    });
    try {
      this.excel.export(this.project.internalid, this.testsList.name, rows);
    } catch (exc: any) {
      this.toaster.toast({
        type: 'error',
        content: exc.message,
        icon: 'fas fa-times',
        time: 2500
      })
    }
  }

  goToTestLists() {
    this.router.navigate(['/projects', this.project.id, 'testCases']);
  }


  save(): Promise<any> {
    this.project.testCasesList.find(tc => tc.id === this.testsList.id).testCases = this.testCases;
    return this.db.saveProject(this.project.toObject())
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
      obtained_result: "",
      test_data: "",
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

  /**
   * Display details of this test
   */
  toggleDetails(index: number) {
    document.querySelector(`#details-${index}`)?.classList.toggle('hidden');
    document.querySelector(`#details-${index}`)?.classList.toggle('flex');
  }

  drop(event: CdkDragDrop<string>) {
    moveItemInArray(this.testCases, event.previousIndex, event.currentIndex);

    this.testCases.forEach((tc: TestCase, index: number) => {
      tc.index = index;
    });

    this.save();
  }

  createPin(): Pin {
    return new Pin({
      id: guid(),
      projectid: this.project.id,
      title: `Tests ${this.testsList.name}`,
      projectinternalid: this.project.internalid,
      category: this.category,
      params: this.testsList.id,
    })
  }

}
