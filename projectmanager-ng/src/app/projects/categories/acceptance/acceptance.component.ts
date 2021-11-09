import { Component, OnInit } from '@angular/core';
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';


@Component({
  selector: 'app-acceptance',
  templateUrl: './acceptance.component.html',
  styleUrls: ['./acceptance.component.scss']
})
export class AcceptanceComponent implements OnInit {

  constructor() { }

  colHeaders = [
    "ID",
    "Test",
    "Jeu de donnée",
    "Résultat attendu",
    "Date",
    "Commentaire"
  ]
  dataset: any[] = [
    {
      id: 0,
      test: "Android",
      testdata: null,
      result: null,
      date: null,
      comment: null,
    },
    {
      id: 1,
      test: "Nom du test ici",
      testdata: "Jeu de données utilisés",
      date: "23/10/2021",
      resultexpected: "Résultat attendu",
      result: 'ici',
      comment: "Commentaire ici"
    }

  ];
  hotSettings: Handsontable.GridSettings = {
    contextMenu: true,
    colHeaders: this.colHeaders,
    hiddenColumns: {
      columns: [0],
    },
    colWidths: [
      0,
      250,
      175,
      150,
      75, // date
      150,
      250
    ],
    rowHeaders: true,
    width: '100%',
    data: this.dataset,
    manualColumnResize: true,
    licenseKey: 'non-commercial-and-evaluation',
  }

  ngOnInit(): void {

    for (let i of [2, 3, 4, 5, 6, 7])
      this.dataset.push({
        id: i,
        test: null,
        testdata: null,
        date: null,
        result: null,
        comment: null
      });
  }

  private hotRegisterer = new HotTableRegisterer();

  ngAfterViewInit() {

    let instance = this.hotRegisterer.getInstance("hotInstance")
    console.log(instance);

    instance.addHook('afterColumnResize', (newSize, column) => {
      console.log("newSize", newSize, "column", column);
    })
  }

  onAfterInit() {
    console.log("init finished");
  }

}
