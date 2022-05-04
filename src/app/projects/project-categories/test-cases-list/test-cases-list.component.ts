import { Component } from '@angular/core';
import { Pin } from 'src/app/model/pin.model';
import { guid, TestCase, TestCasesList } from 'src/app/model/project.model';
import { CategoryComponent } from '../../category.component';
import _ from "underscore";


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
  }

  /**
   * Add a test case
   */
  add() {

    let uid = guid();
    this.project.testCasesList.push({
      id: uid,
      name: '',
      testCases: []
    })
    this.save().then(() => {
      this.router.navigate(['/projects', this.project.id, 'testCases', uid]);
    })
  }

  delete(index: number, $event: any) {
    $event.stopPropagation();
    let res = this.confirmService.confirm("Êtes-vous sûr de vouloir supprimer ces tests ?", "Supprimer des tests");
    if (res) {
      this.project.testCasesList.splice(index, 1);
      this.save();
    }
  }
  clone(tcl: TestCasesList, $event: any) {
    $event.stopPropagation();
    let res = this.confirmService.confirm("Êtes-vous sûr de vouloir duppliquer ces tests ?", "Dupliquer des tests");
    if (res) {

      let uid = guid();
      let testCases = tcl.testCases.slice().map(_.clone) as TestCase[];
      testCases.forEach(test => test.status = "");

      this.project.testCasesList.push({
        id: uid,
        name: `${tcl.name} (copie)`,
        testCases: testCases
      })
      this.save().then(() => {
        this.router.navigate(['/projects', this.project.id, 'testCases', uid]);
      })
    }
  }
  /**
   * Returns the number of test whose status is OK
   * @param tcl 
   */
  checkOkTests(tcl: TestCasesList) {
    return tcl.testCases.filter(tc => tc.status === 'OK').length;
  }
  checkKoTests(tcl: TestCasesList) {
    return tcl.testCases.filter(tc => tc.status === 'KO').length;
  }
  checkUnknownTests(tcl: TestCasesList) {
    return tcl.testCases.filter(tc => tc.status !== 'KO' && tc.status !== 'OK').length;
  }


  get category(): string {
    return 'testCases';
  }

  createPin(): Pin {
    return new Pin({
      id: guid(),
      projectid: this.project.id,
      title: 'Jeux de tests',
      projectinternalid: this.project.internalid,
      category: this.category,
      params: null
    })
  }
}
