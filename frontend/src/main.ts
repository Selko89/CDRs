import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';   // <-- add this import
import { authInterceptor } from './app/core/interceptors/auth-interceptor';
import { routes } from './app/app.routes';         // <-- your route definitions

bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideRouter(routes)   // <-- add router provider here
  ]
}).catch(err => console.error(err));
