import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }
menuData:any
  ngOnInit(): void {
     this.menuData=[
     {
        mainmenu:'Team ACtivity',
        submenu:[
          {
            'name':'Today plan',
            'route':'todayplan'

          },{
            'name':'vallarchi',
             'route':'vallarchi'
          }
        ]
     },
     {
        mainmenu:'Product',
        submenu:[
          {
            'name':'Sprint',
             'route':''

          },{
            'name':'Documents'
          }
        ]
     }

    ]
      
    
  }

}
