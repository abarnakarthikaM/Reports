import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/core-module/service/app.service';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  @Input() reportKey: string;
  @Input() sideMenuKey: string;
  @Input() activeMenu: any;
  @Output() listReport = new EventEmitter();

  public scheduleKey: any;
  public menu: Array<any> = [];

  constructor(public appService: AppService) { }

  ngOnInit(): void {
    this.getSubModules(this.reportKey);
  }

  ngOnChanges(): void {
    this.scheduleKey = history.state;
    // console.log(this.scheduleKey);
    if (this.scheduleKey.userAction == false) {
      // this.sideMenuKey=false
    }
    // console.log(this.sideMenuKey);
    if (this.activeMenu) {
      this.selectMenu(this.menu[this.activeMenu.index]);
    }
  }

  // Menu name and basedon value to the menu info
  public handleSubMenu = (data: any, type: string) => {
    let result: string = type == 'menu' ? data[0].menuName : data[0].basedOn;
    return result;
  };

  // Following method is used for the getting the report list by means of calling report menu api
  public async getSubModules(key: string) {
    const reqData = {
      accessToken: sessionStorage.getItem('accessToken'),
      reportName: 'get-all-report-types',
      reportBasedOn: key,
    };
    // const _subModuleDetail = await this.appService.getSubModuleData(reqData).toPromise();
    let menuData: any = await this.appService
      .getMenuResponse(reqData)
      .toPromise();
    this.menu = menuData.response.data;
    this.menu.map((data: any) => {
      if (data.queueMenu == 'Y')
        this.appService.queueReportEnable = true;
    })
    if (this.appService.selectedMenu != '') this.handleMenuInfo();
    for (let i = 0; i < this.menu.length; i++) {
      let subMenuData = this.menu[i]?.subMenu;
      for (let i = 0; i < subMenuData?.length; i++) {
        subMenuData[i]['activeStatus'] = i == 0 ? 'Y' : 'N';
      }
      if (this.menu[i].activeStatus == 'Y') {
        // if (this.appService.selectedMenu == '') {
        this.appService.selectedMenu =
          this.menu[i].subMenu.length > 0
            ? this.handleSubMenu(this.menu[i].subMenu, 'menu')
            : this.menu[i].menuName;
        this.appService.currentBasedOn =
          this.menu[i].subMenu.length > 0
            ? this.handleSubMenu(this.menu[i].subMenu, 'basedOn')
            : this.menu[i].basedOn;
        // }
      }
    }
    this.menu.filter((data) => {
      data.activeStatus == 'Y'
        ? (this.appService.selectedMenuId = this.menu.indexOf(data))
        : '';
    });
    var initEmit = {
      value: this.menu[this.appService.selectedMenuId].menuName,
      key: this.menu[this.appService.selectedMenuId].moduleKey,
      index: this.appService.selectedMenuId,
      submenu: this.menu[this.appService.selectedMenuId].subMenu,
      activeMenu: this.menu[this.appService.selectedMenuId].menuHeader,
    };
    this.listReport.emit(initEmit);
  }

  // Maintain the selected menu info
  public handleMenuInfo() {
    this.menu.filter((data) => {
      if (data.menuName == this.appService.selectedMenu) {
        data.activeStatus = 'Y';
        this.appService.selectedMenuId = this.menu.indexOf(data);
      } else data.activeStatus = 'N';
    });
  }

  // Triggered after the menu is selected
  public selectMenu(data: any) {
    //Clear radio button variable value when menu changes
    this.appService.radiobuttonType = '';
    // Group pace report dropdown based year picker enable disable.
    if (data.menuName == 'groupPaceReport')
      this.appService.groupPaceInfo.reportDrpDwnValSet = true;
    else {
      this.appService.groupPaceInfo.reportSaveListEnable = true;
      this.appService.groupPaceInfo.reportDrpDwnValSet = false;
    }

    if (data.queueMenu == 'Y')
      this.appService.queueReportEnable = true;
    else
      this.appService.queueReportEnable = false;
    this.appService.selectedMenuName = data.menuHeader;
    this.appService.selectedMenu =
      data.subMenu.length > 0 ? data.subMenu[0].menuName : data.menuName;
    this.appService.currentBasedOn =
      data.subMenu.length > 0 ? data.subMenu[0].basedOn : data.basedOn;
    this.appService.showReportData = undefined;

    if (this.appService.selectedMenuId != this.menu.indexOf(data)) {
      this.appService.selectedMenuId = this.menu.indexOf(data);
      let objVal: any = {
        value: data.menuName,
        key: data.moduleKey,
        index: this.menu.indexOf(data),
        submenu: data.subMenu,
        activeMenu: this.menu[this.appService.selectedMenuId].menuHeader,
      };
      this.listReport.emit(objVal);
    }
    this.appService.menuClick = false;
  }
}

