import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //todo: redirectoin to grouprm conflict page
    document.getElementsByTagName('title')[0].innerText = "Error";
  }

}

