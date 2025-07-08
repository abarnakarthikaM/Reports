To enhance the security of your encryption and decryption keys in your Angular app, follow these steps:

## Step 1: Use Environment Variables Securely

Instead of hardcoding the keys in environment.ts, you can use Angular's runtime environment configuration.

#### 1. Create a new config.json file in the assets folder:

```
src/assets/config.json
```

```
{
  "encryptionKey": "YOUR_ENCRYPTION_KEY",
  "decryptionKey": "YOUR_DECRYPTION_KEY"
}

```

#### 2. Modify ConfigService to load these values at runtime.

```
config.service.ts
```

```
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return this.http.get('/assets/config.json')
      .toPromise()
      .then(config => {
        this.config = config;
      });
  }

  get(key: string): string {
    return this.config[key];
  }
}
```

#### 3. Modify app.module.ts to initialize the ConfigService before app bootstrap.

```
app.module.ts
```

```
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

export function initializeApp(configService: ConfigService): () => Promise<void> {
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


```

#### 4. Use ConfigService in your code.

```
import { ConfigService } from './config.service';

constructor(private configService: ConfigService) {}

ngOnInit() {
  const encryptionKey = this.configService.get('encryptionKey');
}

```