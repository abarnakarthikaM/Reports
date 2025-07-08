/*************************************************
 * TS Component Name ----------  Response interceptor
 * Typescript Functions --------- Shailesh R
 * Created date ------------------- DD/MM/YYYY
 * Powered by -------------------- Infiniti software solutions
 *************************************************/
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../service/config.service';
import { AppService } from '../service/app.service';

declare let CryptoJS: any;
@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  public retry: boolean = false;
  constructor(private configService: ConfigService) { }
  // tslint:disable-next-line: no-any
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    return next.handle(request).pipe(
      map((event: any) => {
        if (event.type !== 0 && event.status === 200) {
          let response: object = {};
          if (event.body.size == undefined && typeof event.body == 'string') {
            // console.log(event.body);
            response = JSON.parse(
              CryptoJS.AES.decrypt(
                event.body.replace(/^"(.*)"$/, '$1'),
                CryptoJS.enc.Base64.parse(this?.configService?.get('de')),
                { mode: CryptoJS.mode.ECB }
              ).toString(CryptoJS.enc.Utf8)
            );
          } else {
            response = event.body;
          }
          event = event.clone({
            body: response,
          });
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {

        // toastr.error('Report Have Some Issues Wait A Moment or Reload the Page');
        // toastr.error(this.appService.responseErrorMsg);
        let data: object = {};
        data = {
          reason: error && error.error.reason ? error.error.reason : '',
          status: error.error,
        };
        return throwError(data);
      })
    );
  }
}
