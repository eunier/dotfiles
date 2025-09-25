import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JWT_CONFIG_TOKEN } from '../../configs/jwt.config';
import { JwtConfig } from '../../models/jwt-config.model';

@Injectable()
export class JwtConfigService {
	public readonly accessTokenTtl: number;
	public readonly audience: string;
	public readonly issuer: string;
	public readonly refreshTokenTtl: number;
	public readonly secret: string;

	public constructor(
		@Inject(JWT_CONFIG_TOKEN) private readonly jwtConfig: ConfigType<JwtConfig>,
	) {
		this.accessTokenTtl = +this.jwtConfig.accessTokenTtl;
		this.audience = this.jwtConfig.audience;
		this.issuer = this.jwtConfig.issuer;
		this.refreshTokenTtl = +this.jwtConfig.refreshTokenTtl;
		this.secret = this.jwtConfig.secret;
	}
}
