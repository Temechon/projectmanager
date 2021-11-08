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

        // If only one type of result, take it
        if (this.results.length === 1) {
          let res: { field: string, result: any[] } = this.results[0];

          // If only one result, forward to the only match
          if (res.result.length === 1) {
            let firstRes = res.result[0];
            if (firstRes.doc.type === 'project') {
              this.goTo(firstRes.id);
            }
            else if (firstRes.doc.type === 'report') {
              this.goToReport(firstRes.doc.p_id, firstRes.id);
            }
            else if (firstRes.doc.type === 'note') {
              this.goToNote(firstRes.doc.p_id, firstRes.id);
            }
            else if (firstRes.doc.type === 'activity') {
              this.goToActivity(firstRes.doc.p_id, firstRes.id);
            }
          }
        }
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goTo(res: string, path?: string) {
    this.router.navigate(['/projects', res]);
  }

  goToReport(pid: string, reportid: string) {
    this.router.navigate(['/projects', pid, 'reports'], { queryParams: { id: reportid } })
  }

  goToNote(pid: string, noteid: string) {
    this.router.navigate(['/projects', pid, 'notes'], { queryParams: { id: noteid } });
  }

  goToActivity(pid: string, activityid: string) {
    this.router.navigate(['/projects', pid, 'activities'], { queryParams: { id: activityid } });
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

  getColorForType(type: string) {
    let classname = "";
    switch (type) {
      case "project":
        classname = "border-primary";
        break;
      case "report":
        classname = "border-secondary";
        break;
      case "note":
        classname = "border-accent ";
        break;
      default:
        classname = "border-white ";
    }
    return classname;
  }

}
