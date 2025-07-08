import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
declare var $ : any;
declare var feather: any;
/**
 * Author : Naveen
 * Desc :  alert
 */
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

/**
 * get image path
 */
  @Input() public userInput :any = {};
  @Input() public deleteRowContent : any;
  /**
  * output data
  */
  @Output() public choosedVal: EventEmitter<boolean> = new EventEmitter();
  /**
  * Desc: on closing alert add class close design 
  */
  public toClose: boolean = false;
  constructor() { }

  public ngOnInit() { 
    $('body').css("overflow", "hidden");
    console.log(this.deleteRowContent);
    
  }
  public ngOnChanges(){

  }
  public ngAfterViewInit() : void {
    feather.replace();
  }
  /**
   * close modal
   */
  public closeModal(val: boolean) : void {
    const dataVal : any = {
      flag : val
    }
    this.toClose = true;
    
    // $('.cls-popup').addClass('close-ani');
    $('#fn-background').removeClass('cls-background');
    $('body').css("overflow", "auto");
    var nextTr = $(this.deleteRowContent).attr('class').split(' ');
    setTimeout(() => {
      this.choosedVal.emit(dataVal);
      (val == false) ? $(this.deleteRowContent).find('.cls-delete-icon').focus() : '' ;
    }, 400);
    setTimeout(() => {
      (val == true) ? $('.'+nextTr[0]).focus() : '' ;
    }, 1000);
    
  }
  /**
  * removeError
  */
  public removeError() : void {
    if($('#reason').val().length > 0 ) {
      $('#reason').removeClass('cls-error');
    }
  }
}
