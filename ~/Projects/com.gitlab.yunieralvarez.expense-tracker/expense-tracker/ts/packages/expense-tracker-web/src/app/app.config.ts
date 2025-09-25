import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
	HTTP_INTERCEPTORS,
	provideHttpClient,
	withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './auth/interceptors/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(withInterceptorsFromDi()),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
	],
};
