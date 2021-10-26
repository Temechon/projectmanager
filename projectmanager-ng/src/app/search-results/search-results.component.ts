import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from '../services/search.service';
import Fuse from 'fuse.js';
import { Project } from '../model/project.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private searchService: SearchService) { }

  private sub: Subscription;

  results: Fuse.FuseResult<any>[];

  ngOnInit(): void {

    this.sub = this.route.queryParams.subscribe(params => {
      let query = params.query;
      console.log("query", query);

      if (query) {
        this.results = this.searchService.search(query);
        console.log("results", this.results);
      }
    }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getMatch(item: Project, match: Fuse.FuseResultMatch) {
    let type = ""
    // type
    if (match.key.indexOf('actors') >= 0) {
      type = "Acteur"
    } else if (match.key.indexOf('reports') >= 0) {
      type = "Compte-rendu"
    } else {
      type = "Projet"
    }

    return `${type} --> ${match.value}`
  }

}
