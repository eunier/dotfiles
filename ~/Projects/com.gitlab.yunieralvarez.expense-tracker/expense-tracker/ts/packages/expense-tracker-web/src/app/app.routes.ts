import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
	},
	{
		path: 'debug',
		loadChildren: () => import('./debug/debug.routes').then((m) => m.routes),
	},
	{
		path: 'link',
		loadChildren: () => import('./link/link.routes').then((m) => m.routes),
	},
	{ path: '', redirectTo: 'auth', pathMatch: 'full' },
];
