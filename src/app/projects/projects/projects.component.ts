import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/model/project.model';
import { DatabaseService } from 'src/app/services/database.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor(
    private db: DatabaseService,
    private router: Router,
    private renderer: Renderer2,
    private index: SearchService
  ) { }

  projects: Project[];
  runningProjects: Project[] = [];
  waitingProjects: Project[] = [];

  sidebarCollapsed = false;

  unlisten: Array<() => void> = [];

  ngOnInit() {

    this.renderer.listen('document', 'keydown.control.f', (event: KeyboardEvent) => {
      let input = (document.querySelector('#searchbar') as HTMLInputElement)
      input.focus();
      input.setSelectionRange(0, input.value.length)
      event.stopPropagation();
      event.preventDefault();
    })

    this.db.getProjects$().subscribe(data => {

      this.projects = data;
      this.runningProjects = data.filter(d => d.status == Project.STATUS.running);
      this.waitingProjects = data.filter(d => d.status == Project.STATUS.waiting);
      // Sort projects list by project internal id
      this.runningProjects.sort((a: Project, b: Project) => {
        let internalid = Number.parseInt(a.internalid);
        let internalid2 = Number.parseInt(b.internalid);
        return internalid - internalid2;
      });
      this.waitingProjects.sort((a: Project, b: Project) => {
        let internalid = Number.parseInt(a.internalid);
        let internalid2 = Number.parseInt(b.internalid);
        return internalid - internalid2;
      });

      let keys = ['&', 'é', '"', "'", '(', '-', 'è', '_', 'ç']
      let index = 0;
      // remove any listeners
      this.unlisten.forEach(item => item());
      this.unlisten = [];

      // Add a listener for each project
      for (let project of this.projects) {
        let key = keys[index];

        let listener = this.renderer.listen('document', 'keydown.control.' + key, (event: KeyboardEvent) => {
          this.router.navigate(['projects', project.id])
          event.stopPropagation();
          event.preventDefault();
        });
        this.unlisten.push(listener);
        index++;
      }

      let url = this.router.url;
      if (url === "/projects" && this.projects.length > 0) {
        this.router.navigate(['projects', this.projects[0].id])
      }
    })

  }



  addProject() {
    let proj = new Project();
    this.db.saveProject(proj).then(d => {
      this.index.addProject(proj);
      console.log("Project créé!", d);
      this.router.navigate(['projects', d.id])
    })
  }

  trackByProjectId(index: number, project: any) {
    return project.id
  }

  toggleSidebar() {

    let chevron = document.querySelector('#chevron');
    chevron.classList.toggle('rotate-180')

    let projectLabel = document.querySelectorAll('.project-label');
    projectLabel.forEach(item => item.classList.toggle('hidden'))

    let projectLists = document.querySelector('#project-list');
    projectLists.classList.toggle('mt-16')

    let projects = document.querySelectorAll('.project');
    projects.forEach(item => {
      item.classList.toggle('pl-4')
      item.classList.toggle('justify-center')
    })

    let projectNames = document.querySelectorAll('.project-name');
    projectNames.forEach(item => item.classList.toggle('hidden'))

    // hide all project-tags
    let projectTags = document.querySelectorAll('.project-tag');
    projectTags.forEach(item => item.classList.toggle('hidden'))

    let projectIds = document.querySelectorAll('.project-id');
    projectIds.forEach(item => item.classList.toggle('mr-4'))


    let sidebar = document.querySelector('#sidebar');
    sidebar.classList.toggle('w-[15%]')
    sidebar.classList.toggle('w-14');

    let content = document.querySelector('#content');
    content.classList.toggle('w-[calc(100%-15%)]')
    content.classList.toggle('w-[calc(100%-3.5rem)]')

    let buttonWide = document.querySelector('#button-wide');
    buttonWide.classList.toggle('hidden')
    let button = document.querySelector('#button');
    button.classList.toggle('hidden')

    // Toolbar
    let actionNames = document.querySelectorAll('.action-name');
    actionNames.forEach(item => item.classList.toggle('hidden'));
    let actions = document.querySelectorAll('.action');
    actions.forEach(item => item.classList.toggle('justify-center'));




  }


  searchEverywhere($event: Event) {
    let searchTerm = ($event.target as HTMLInputElement).value;
    // Display search component
    this.router.navigate(['projects', 'search'], { queryParams: { query: searchTerm } })
  }

}
