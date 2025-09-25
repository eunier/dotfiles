import { Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleLib } from '@nestjs/config';
import * as Joi from 'joi';
import { appConfig } from '~/app/config/configs/app.config';
import { jwtConfig } from '~/app/config/configs/jwt.config';
import { plaidConfig } from '~/app/config/configs/plaid.config';
import { postgresConfig } from '~/app/config/configs/postgres.config';
import { AppEnv } from '~/app/config/enums/app-env.enum';
import { ConfigKey } from '~/app/config/enums/config-key.enum';
import { AppConfigService } from '~/app/config/services/app-config/app-config.service';
import { Config } from '~/app/config/services/config/config.service';
import { JwtConfigService } from '~/app/config/services/jwt-config/jwt-config.service';
import { PlaidConfigService } from '~/app/config/services/plaid-config/plaid-config.service';
import { PostgresConfigService } from '~/app/config/services/postgres-config/postgres-config.service';

@Module({
	imports: [
		ConfigModuleLib.forRoot({
			cache: true,
			load: [appConfig, jwtConfig, plaidConfig, postgresConfig],
			validationSchema: Joi.object({
				[ConfigKey.AppEnv]: Joi.string()
					.allow(AppEnv.Development, AppEnv.Production)
					.required(),
				[ConfigKey.AppPlaidClientName]: Joi.string().required(),
				[ConfigKey.AppPlaidTransactionSyncCount]: Joi.number().required(),
				[ConfigKey.AppPort]: Joi.number().required(),
				[ConfigKey.JwtAccessTokenTtl]: Joi.number().required(),
				[ConfigKey.JwtRefreshTokenTtl]: Joi.number().required(),
				[ConfigKey.JwtSecret]: Joi.string().required(),
				[ConfigKey.JwtTokenAudience]: Joi.string().required(),
				[ConfigKey.JwtTokenIssuer]: Joi.string().required(),
				[ConfigKey.PlaidClientId]: Joi.string().required(),
				[ConfigKey.PlaidCountryCodes]: Joi.string().required(),
				[ConfigKey.PlaidEnv]: Joi.string().required(),
				[ConfigKey.PlaidProducts]: Joi.string().required(),
				[ConfigKey.PlaidRedirectUri]: Joi.string().required(),
				[ConfigKey.PlaidSecret]: Joi.string().required(),
				[ConfigKey.PlaidVersion]: Joi.string().required(),
				[ConfigKey.PostgresDatabase]: Joi.string().required(),
				[ConfigKey.PostgresHost]: Joi.string().required(),
				[ConfigKey.PostgresPassword]: Joi.string().required(),
				[ConfigKey.PostgresPort]: Joi.number().required(),
				[ConfigKey.PostgresUsername]: Joi.string().required(),
			}),
		}),
	],
	providers: [
		AppConfigService,
		JwtConfigService,
		PlaidConfigService,
		PostgresConfigService,
		Config,
	],
	exports: [Config],
})
export class ConfigModule {}
