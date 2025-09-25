import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerFactory } from '../../../log/services/logger-factory/logger-factory.service';
import { Logger } from '../../../log/services/logger/logger.service';
import { Token } from '../../enums/token.enum';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
	private readonly logger: Logger;
	private isRefreshing = false;

	constructor(
		private readonly authService: AuthService,
		private readonly loggerFactory: LoggerFactory,
	) {
		this.logger = this.loggerFactory.create(this);
	}

	public intercept(req: HttpRequest<unknown>, next: HttpHandler) {
		return from(this.handleRequest(req, next));
	}

	private async handleRequest(req: HttpRequest<unknown>, next: HttpHandler) {
		const accessToken = this.authService.getToken(Token.AccessToken);

		if (accessToken) {
			req = this.addToken(req, accessToken);
		}

		if (req.url.endsWith('/api/auth/refresh')) {
			return lastValueFrom(next.handle(req));
		}

		return lastValueFrom(
			next.handle(req).pipe(
				catchError((error: HttpErrorResponse) => {
					if (error.status === 401 && !req.url.includes('/api/auth/refresh')) {
						return from(this.handle401Error(req, next));
					}

					return throwError(() => error);
				}),
			),
		);
	}

	private addToken(request: HttpRequest<unknown>, token: string) {
		this.logger.debug('Adding token to request...', token);

		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
	}

	private async handle401Error(
		req: HttpRequest<unknown>,
		next: HttpHandler,
	): Promise<HttpEvent<unknown>> {
		this.logger.info('Token expired, refreshing...');

		if (!this.isRefreshing) {
			this.isRefreshing = true;

			try {
				await this.authService.refresh({
					refreshToken: this.authService.getToken(Token.RefreshToken)!,
				});

				this.isRefreshing = false;
				const updatedToken = this.authService.getToken(Token.AccessToken)!;

				return await lastValueFrom(
					next.handle(this.addToken(req, updatedToken)),
				);
			} catch (error) {
				this.isRefreshing = false;
				this.authService.logout();
				throw error;
			}
		}

		throw new Error('Token refresh already in progress.');
	}
}
