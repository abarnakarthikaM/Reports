import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RequestInterceptor } from "./interceptors/request.interceptor";
import { ResponseInterceptor } from "./interceptors/response.interceptor";
import { CoreModuleRoutingModule } from './core-module-routing.module';
import { TranslatePipe } from './pipes/translate.pipe';
import { ToMatrixPipe } from './pipes/to-matrix.pipe';
import { RemoveUnderscorePipe } from './pipes/remove-underscore.pipe';

@NgModule({
  declarations: [ TranslatePipe, ToMatrixPipe, RemoveUnderscorePipe],
  imports: [
    CommonModule,
    HttpClientModule,
    CoreModuleRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true,
    }
  ],
  exports: [ TranslatePipe, ToMatrixPipe, RemoveUnderscorePipe]
})
export class CoreModuleModule { }
