import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthComponent } from '../../components/auth/auth.component';

@Component({
	selector: 'app-auth-page',
	imports: [AuthComponent],
	templateUrl: './auth-page.component.html',
	styleUrl: './auth-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {}
