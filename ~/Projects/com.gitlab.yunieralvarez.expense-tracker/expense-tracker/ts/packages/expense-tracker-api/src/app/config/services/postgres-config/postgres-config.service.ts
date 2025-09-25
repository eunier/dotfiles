import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { POSTGRES_CONFIG_TOKEN } from '~/app/config/configs/postgres.config';
import { PostgresConfig } from '~/app/config/models/postgres-config.model';

@Injectable()
export class PostgresConfigService {
	public readonly connectionString: string;

	constructor(
		@Inject(POSTGRES_CONFIG_TOKEN)
		private readonly postgresConfig: ConfigType<PostgresConfig>,
	) {
		this.connectionString =
			PostgresConfigService.createConnectionString(postgresConfig);
	}

	public static createConnectionString(config: ConfigType<PostgresConfig>) {
		const { username, password, host, port, database } = config;
		return `postgres://${username}:${password}@${host}:${port}/${database}`;
	}
}
