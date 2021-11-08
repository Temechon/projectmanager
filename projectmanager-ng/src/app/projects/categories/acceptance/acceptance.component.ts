import { Component, OnInit } from '@angular/core';

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
      result: "Résultat attendu",
      comment: "Commentaire ici"
    }
  ];

  ngOnInit(): void {

    for (let i in [2, 3, 4, 5, 6, 7])
      this.dataset.push({
        id: i,
        test: null,
        testdata: null,
        date: null,
        result: null,
        comment: null
      });
  }

}
