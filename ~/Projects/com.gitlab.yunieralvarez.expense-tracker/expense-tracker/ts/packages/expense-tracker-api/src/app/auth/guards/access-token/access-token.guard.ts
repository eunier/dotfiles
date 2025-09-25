import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { REQUEST_USER_KEY } from '~/app/auth/constants/auth.constants';
import { ActiveUserData } from '~/app/auth/models/active-user-data.model';
import { Config } from '~/app/config/services/config/config.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
	private readonly logger = new Logger(AccessTokenGuard.name);

	constructor(
		private readonly config: Config,
		private readonly jwtService: JwtService,
	) {}

	public async canActivate(context: ExecutionContext) {
		this.logger.debug('Checking access token...');

		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException('No token found');
		}

		try {
			const payload = await this.jwtService.verifyAsync<ActiveUserData>(token, {
				audience: this.config.jwt.audience,
				issuer: this.config.jwt.issuer,
				secret: this.config.jwt.secret,
			});

			if (payload) {
				this.logger.debug('Token verified successfully');
				request[REQUEST_USER_KEY] = payload;
				return true;
			}
		} catch (err) {
			const errMsg = err instanceof Error ? err.message : '';

			this.logger.debug(
				`Token verification failed${errMsg ? `: ${errMsg}` : ''}`,
			);
		}

		this.logger.debug('User is not authenticated');
		return false;
	}

	private extractTokenFromHeader(request: Request) {
		this.logger.debug('Extracting token...');

		const token = (
			(
				request.headers as unknown as { authorization?: string }
			).authorization?.split(' ') ?? []
		).at(1);

		if (token) {
			this.logger.debug('Token extracted successfully');
		}

		return token;
	}
}
