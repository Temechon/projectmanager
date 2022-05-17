import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Pin } from 'src/app/model/pin.model';
import { Project } from 'src/app/model/project.model';
import { DatabaseService } from 'src/app/services/database.service';
import { SearchService } from 'src/app/services/search.service';
import _ from 'underscore';


@Component({
  selector: 'app-projects',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  constructor(
    private db: DatabaseService,
    private router: Router,
    private renderer: Renderer2,
    private index: SearchService
  ) { }

  projects: Project[];
  runningProjects: Project[] = [];
  waitingProjects: Project[] = [];

  /** The list of element pinned on the top of the window */
  pins: Array<Pin> = [];

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

    this.db.getPins$().subscribe(d => {
      this.pins = d;
    })

    // Get all projects once
    this.db.getProjects().then(data => {

      this.projects = data;
      let runningProjects = data.filter(d => d.status == Project.STATUS.running);

      let url = this.router.url;
      if (url === "/projects") {

        // If no projects, create one
        if (data.length === 0) {
          this.addProject()
          console.log("new project");

        } else if (runningProjects.length > 0) {
          // order running project by internal id and use the first one
          let firstId = _.sortBy(runningProjects, 'internalid')[0].id;
          this.router.navigate(['projects', firstId])
        } else {
          // Display the first project
          this.router.navigate(['projects', this.projects[0].id])
        }
      }

    });


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
    })

  }



  addProject() {
    let proj = new Project();
    this.db.saveProject(proj).then(d => {
      console.log("Project créé!", d);
      setTimeout(() => {
        this.router.navigate(['projects', proj.id])
      }, 10)
    })
  }

  trackByProjectId(index: number, project: any) {
    return project.id
  }

  toggleSidebar() {

    // Remove searchbar
    let searchbar = document.querySelector('#searchbar') as HTMLInputElement;
    searchbar.classList.toggle('hidden')

    let chevron = document.querySelector('#chevron');
    chevron.classList.toggle('rotate-180')
    chevron.classList.toggle('right-3.5')
    chevron.classList.toggle('right-5')

    let todo = document.querySelector('#todo') as HTMLInputElement;
    todo.classList.toggle('mt-4')
    todo.classList.toggle('mt-16')

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

  goToPin(pin: any) {
    if (pin.params) {
      this.router.navigate(['projects', pin.projectid, pin.category, pin.params]);
    } else {
      this.router.navigate(['projects', pin.projectid, pin.category]);
    }
  }

}
