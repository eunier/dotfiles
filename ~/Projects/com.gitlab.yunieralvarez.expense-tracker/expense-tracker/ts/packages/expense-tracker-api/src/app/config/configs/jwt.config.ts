import { registerAs } from '@nestjs/config';
import { ConfigKey } from '~/app/config/enums/config-key.enum';
import { JwtConfigFactory } from '~/app/config/models/jwt-config-factory.model';

export const jwtConfig = registerAs(
	'jwt',
	() =>
		({
			accessTokenTtl: process.env[ConfigKey.JwtAccessTokenTtl]!,
			audience: process.env[ConfigKey.JwtTokenAudience]!,
			issuer: process.env[ConfigKey.JwtTokenIssuer]!,
			refreshTokenTtl: process.env[ConfigKey.JwtRefreshTokenTtl]!,
			secret: process.env[ConfigKey.JwtSecret]!,
		}) satisfies JwtConfigFactory,
);

export const JWT_CONFIG_TOKEN = jwtConfig.KEY;
