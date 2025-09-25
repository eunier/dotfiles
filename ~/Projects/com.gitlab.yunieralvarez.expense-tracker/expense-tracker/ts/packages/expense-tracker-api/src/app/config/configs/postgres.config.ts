import { registerAs } from '@nestjs/config';
import { ConfigKey } from '~/app/config/enums/config-key.enum';
import { PostgresConfigFactory } from '~/app/config/models/postgres-config-factory.model';

export const postgresConfig = registerAs(
	'postgres',
	() =>
		({
			database: process.env[ConfigKey.PostgresDatabase]!,
			host: process.env[ConfigKey.PostgresHost]!,
			password: process.env[ConfigKey.PostgresPassword]!,
			port: process.env[ConfigKey.PostgresPort]!,
			username: process.env[ConfigKey.PostgresUsername]!,
		}) satisfies PostgresConfigFactory,
);

export const POSTGRES_CONFIG_TOKEN = postgresConfig.KEY;
