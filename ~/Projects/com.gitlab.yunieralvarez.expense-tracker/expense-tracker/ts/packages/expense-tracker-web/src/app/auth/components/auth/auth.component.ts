import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { LoggerFactory } from '../../../log/services/logger-factory/logger-factory.service';
import { Logger } from '../../../log/services/logger/logger.service';
import { AuthFormControlName as FormControlName } from '../../enums/auth-form-control-name';
import { AuthMode as Mode } from '../../enums/auth-mode';
import { AuthService } from '../../services/auth/auth.service';

@Component({
	selector: 'app-auth',
	imports: [
		FlexLayoutModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		RouterModule,
	],
	templateUrl: './auth.component.html',
	styleUrl: './auth.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
	private readonly mode = signal(Mode.Login);

	public welcomeLabel = computed(() =>
		this.mode() === Mode.Login ? 'Welcome Back' : 'Welcome',
	);

	public submitLabel = computed(() =>
		this.mode() === Mode.Login ? 'Login' : 'Register',
	);

	public linkLabel = computed(() =>
		this.mode() === Mode.Login ? 'Register' : 'Login',
	);

	public linkAddress = computed(() =>
		this.mode() === Mode.Login ? '../register' : '../login',
	);

	public questionLabel = computed(() =>
		this.mode() === Mode.Login
			? "Don't have a account?"
			: 'Already have an account?',
	);

	public FormControlName = FormControlName;

	public form = new FormGroup({
		[FormControlName.Email]: new FormControl('', Validators.email),
		[FormControlName.Password]: new FormControl('', Validators.minLength(8)),
	});
	private readonly logger: Logger;

	constructor(
		private readonly authService: AuthService,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly loggerFactory: LoggerFactory,
	) {
		this.logger = this.loggerFactory.create(this);
		const url = toSignal(this.route.url);
		this.mode.set(url()?.at(0)?.path === 'login' ? Mode.Login : Mode.Register);
	}

	public async onSubmit() {
		this.logger.debug('Submitting form with value:', this.form.value);

		const email = this.form.get(FormControlName.Email)?.value;
		const password = this.form.get(FormControlName.Password)?.value;

		if (this.mode() === Mode.Register && email && password) {
			try {
				await this.authService.register({ email, password });

				this.router.navigate(['../login'], {
					relativeTo: this.route,
				});
			} catch (error) {
				this.logger.error('Error during registration', error);
			}
		}

		if (this.mode() === Mode.Login && email && password) {
			try {
				await this.authService.login({ email, password });
				this.router.navigate(['../../link'], { relativeTo: this.route });
			} catch (error) {
				this.logger.error('Error during login', error);
			}
		}
	}
}
