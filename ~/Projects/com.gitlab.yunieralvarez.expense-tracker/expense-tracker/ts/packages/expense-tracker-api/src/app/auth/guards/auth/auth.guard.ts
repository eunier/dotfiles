import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Auth } from '~/app/auth/decorators/auth.decorator';
import { AuthType } from '~/app/auth/enums/auth-type.enum';
import { AccessTokenGuard } from '~/app/auth/guards/access-token/access-token.guard';

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger = new Logger(AuthGuard.name);

	private readonly authTypeGuardMap: Record<
		AuthType,
		CanActivate | CanActivate[]
	>;

	constructor(
		private readonly accessTokenGuard: AccessTokenGuard,
		private readonly reflector: Reflector,
	) {
		this.authTypeGuardMap = {
			[AuthType.Bearer]: this.accessTokenGuard,
			[AuthType.None]: { canActivate: () => true },
		};
	}

	public async canActivate(context: ExecutionContext) {
		let authTypes = this.reflector.get(Auth, context.getHandler()) ?? [
			AuthType.Bearer,
		];

		if (!Array.isArray(authTypes)) {
			authTypes = [authTypes];
		}

		const guards = authTypes.flatMap((type) => this.authTypeGuardMap[type]);
		let error = new UnauthorizedException();

		for (const instance of guards) {
			try {
				if (await this.evaluateGuard(instance, context)) {
					this.logger.debug('User is authenticated');
					return true;
				}
			} catch (err) {
				error = err;
				const errMsg = err instanceof Error ? err.message : '';

				this.logger.debug(
					`Guard rejected authentication${errMsg ? `: ${errMsg}` : ''}`,
				);
			}
		}

		this.logger.debug('User is not authenticated');
		throw error;
	}

	private async evaluateGuard(
		instance: CanActivate,
		context: ExecutionContext,
	) {
		const canActivate = instance.canActivate(context);

		if (typeof canActivate === 'boolean') {
			return canActivate;
		}

		if (canActivate instanceof Promise) {
			return await canActivate;
		}

		if (canActivate instanceof Observable) {
			return await firstValueFrom(canActivate);
		}

		return false;
	}
}
