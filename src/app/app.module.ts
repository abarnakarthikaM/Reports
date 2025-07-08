import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModuleModule } from './core-module/core-module.module';
import { SharedModuleModule } from './shared-module/shared-module.module';
import { DatePipe } from '@angular/common';
import { ConfigService } from './core-module/service/config.service';

export function initializeApp(configService: ConfigService): () => void {
  return () => configService.loadConfig();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CoreModuleModule,
    SharedModuleModule
  ],
  providers: [
    DatePipe,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
