import { Routes } from '@angular/router';
import { AuthPageComponent } from './pages/auth/auth-page.component';

export const routes: Routes = [
	{ path: 'register', component: AuthPageComponent },
	{ path: 'login', component: AuthPageComponent },
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
];
