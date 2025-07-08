import { Component, Input, OnInit } from '@angular/core';
import { appConfig } from 'src/app/core-module/config/app';
/******
 * component : language component
 * created : 17-06-2021
 * Author : Benita Shiny P.
 */
@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  /**
   * languages list
   */
  public languageData = [
    {
      code:'EN',
      name:'English'
    },
    {
      code:'AR',
      name:'Spanish'
    },
    {
      code:'PT',
      name:'Portuguese'
    }
  ];
  /**
   * Desc: Language value
   */
  // public choosenLanguage = 'EN';
  @Input() choosenLanguage : string;
  /**
   * display language option
   */
  public displayOption : boolean = appConfig.DISPLAYlANGUAGEOPTION;
  constructor() {
    // const language =  document.cookie.match(new RegExp('(^| )' + 'groupRMLan' + '=([^;]+)')) as string[];
    // // if cookie exist set the cookie language else set default laguage as EN( English )
    // if (language) {
    //   this.choosenLanguage = language[2];
    //   appConfig.CURRENTLANGUAGE = this.choosenLanguage;
    // } else {
    //   appConfig.CURRENTLANGUAGE = 'EN';
    // }
  }
  public ngOnInit(): void {
    
  }
  ngOnChanges(){
    if(this.choosenLanguage){
      appConfig.CURRENTLANGUAGE = this.choosenLanguage;
    } else {
      appConfig.CURRENTLANGUAGE = 'EN';
    }
  }
   /**
   * Author: Shailesh R
   * Desc: Set language for the application
   * @param: lang: Language name
   */
  public setLanguage(index: number): void {
    appConfig.CURRENTLANGUAGE = this.languageData[index].code;
    this.choosenLanguage = this.languageData[index].code;
    document.cookie = `groupRMLan=${this.choosenLanguage}`;
  }
}
