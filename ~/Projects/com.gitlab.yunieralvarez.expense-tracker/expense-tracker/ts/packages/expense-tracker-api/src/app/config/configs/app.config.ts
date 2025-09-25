import { registerAs } from '@nestjs/config';
import { AppEnv } from '~/app/config/enums/app-env.enum';
import { ConfigKey } from '~/app/config/enums/config-key.enum';
import { AppConfigFactory } from '~/app/config/models/app-config-factory.model';

export const appConfig = registerAs(
	'app',
	() =>
		({
			env: process.env[ConfigKey.AppEnv]! as AppEnv,
			plaidClientName: process.env[ConfigKey.AppPlaidClientName]!,
			plaidTransactionSyncCount:
				process.env[ConfigKey.AppPlaidTransactionSyncCount]!,
			plaidTransactionSyncOnFailureDelay:
				process.env[ConfigKey.AppPlaidTransactionSyncOnFailureDelay]!,
			port: process.env[ConfigKey.AppPort]!,
		}) satisfies AppConfigFactory,
);

export const APP_CONFIG_TOKEN = appConfig.KEY;
