import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideRouter }        from '@angular/router';
import { importProvidersFrom }  from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { routes }       from './app/app.routes';

bootstrapApplication(AppComponent, appConfig).then(() => {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
