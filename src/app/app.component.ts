import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from './core-module/animation/route-animation';
import { AppService } from './core-module/service/app.service';
import { ThemeService } from './core-module/service/theme.service'
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CommonService } from './core-module/service/common.service';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  title = 'grmDashboard';
  themeType = false;
  public activeRoute = '';
  private animation = false;
  public loader = true;
  public language: string;

  constructor(private router: Router, private service: AppService, private commonService: CommonService, private themeService: ThemeService) {
    this.authUrl();
  }

  ngOnInit() {
    // Get the GroupRM tool instance 
    const windowParent = (window.parent as any)
    if (typeof windowParent.iframeLoader == 'function')
      windowParent.iframeLoader()
  }

  private async authUrl() {
    sessionStorage.clear();
    const response: Load = await this.service.initAuth();
    this.language = (response as any).response.data.language;
    try {
      // tslint:disable-next-line:max-line-length
      this.router.navigate([(response as any).response.data.routeModule]);
      this.router.initialNavigation();
      this.animation = true;
      this.loader = false;
      this.router.initialNavigation();
    } catch (e) {
      this.loader = false;
      this.router.navigate(['./11f9578d05e6f7bb58a3cdd00107e9f4e3882671']);
      this.router.resetConfig([{ path: '**', loadChildren: () => import('./shared-module/error/error.module').then(m => m.ErrorModule) }]);
      this.animation = false;
    }
    // 
    // let reqData = {
    //   'apiToken': 'xxxxx',
    //   'emailID': 'yyy@xx.com'
    // }
    // var authResponce = await this.service.authenticationAndAuthorization(reqData).toPromise();
    var authResponce = {
      "responseCode": 0,
      "responseMessage": "ok",
      "responseData": {
        'airlineCode': '',
        'userType': 'Airline',
        'accessToken': "XXXXX"
      }
    }
    if ((response as any).responseCode == 0) {
      // this.service.responseErrorMsg = (response as any)?.response?.data?.errorMsg;
      var requestHistory = (response as any).response.data.routeModule;
      if (requestHistory == '1aba9077fcda52d2481a28b15df0625f7b8845d0') {
        $('.cls-report').addClass('cls-request-history');
      }

      sessionStorage.setItem(
        'accessToken',
        authResponce.responseData.accessToken
      );
      sessionStorage.setItem(
        'userActionKey',
        (response as any).response.data.userAction
      );
      sessionStorage.setItem(
        'themeCode',
        (response as any).response.data.airlineCode
      );
      if ((response as any).response.data.menu)
        sessionStorage.setItem(
          'menu',
          (response as any).response.data.menu
        );
      if ((response as any).response.data.primaryColor)
        this.service.primaryColor = (response as any).response.data.primaryColor
      sessionStorage.setItem(
        'primaryColor',
        (response as any).response.data.primaryColor
      );
      if ((response as any).response.data.secondaryColor)
        this.service.secondaryColor = (response as any).response.data.secondaryColor
      sessionStorage.setItem(
        'secondaryColor',
        (response as any).response.data.secondaryColor
      );
      if ((response as any).response.data.routeModule == '27664bd06a7b7615a856b295affc3d59c25ac0e6')
        sessionStorage.setItem(
          'summaryRoute',
          'true'
        );

      if ((response as any).response.data.primaryColor)
        this.themeService.themeCall();
      else
        this.commonService.themeCall();
      this.service.summaryReport();
    }

  }

  public getRouterOutletState(outlet: any): any {
    this.activeRoute = /[^/]*$/.exec(this.router.url)[0];
    return outlet.isActivated && this.animation ? outlet.activatedRoute : '';
  }
}
interface Load {
  route: string;
  responseMessage: string;
  status: number;
}
