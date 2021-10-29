import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) { }

  private sub: Subscription;

  results: any[];
  query: string = "";

  ngOnInit(): void {

    this.sub = this.route.queryParams.subscribe(params => {
      this.query = params.query;
      console.log("query", this.query);

      if (this.query) {
        this.results = this.searchService.search(this.query);
        console.log("results", this.results);

        // If only one result, forward to the only match
        // if (this.results.length === 1) {
        //   let res = this.results[0];
        //   if (res.matches.length === 1) {
        //     let url = this.buildUrl(res.item, res.matches[0]);
        //     this.router.navigate(url.path, url.params);
        //   }
        // }
      }
    }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // buildUrl(item: Project, match: Fuse.FuseResultMatch): { path: string[], params?: any } {
  //   let res = ['projects', item.id]

  //   if (match.key.indexOf('actors') >= 0) {
  //     res.push('actors');
  //     return { path: res };

  //   } else if (match.key.indexOf('reports') >= 0) {
  //     res.push('reports')
  //     let report = item.reports[match.refIndex];
  //     let queryParams = {
  //       queryParams: { id: report.id }
  //     }
  //     return { path: res, params: queryParams };

  //   }

  //   return { path: res };
  // }

  goTo(res: string) {
    this.router.navigate(['/projects', res])
  }

  goToReport(pid: string, reportid: string) {
    this.router.navigate(['/projects', pid, 'reports'], { queryParams: { id: reportid } })
  }


  snippet(_content: string) {

    let content = _content.replace(/<\/p>/g, " ").replace(/<.*?>/g, "").trim();
    const find = new RegExp(this.query, "gmi");

    const nbchar = 100;
    const match = find.exec(content);
    const first = match.index - nbchar >= 0 ? match.index - nbchar : 0;
    const last = match.index + match[0].length + nbchar;

    let text = `...${content.substring(first, last)}...`;

    const snippet = text.replace(find, "<span class='text-secondary font-semibold'>" + this.query + "</span>")
    return snippet
  }

}
