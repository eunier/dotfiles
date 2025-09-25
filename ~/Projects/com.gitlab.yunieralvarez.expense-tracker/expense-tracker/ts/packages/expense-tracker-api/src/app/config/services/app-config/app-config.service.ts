import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { APP_CONFIG_TOKEN } from '~/app/config/configs/app.config';
import { AppEnv } from '~/app/config/enums/app-env.enum';
import { AppConfig } from '~/app/config/models/app-config.model';

@Injectable()
export class AppConfigService {
	public plaidTransactionSyncCount: number;
	public readonly plaidClientName: string;
	public readonly plaidTransactionSyncOnFailureDelay: number;
	public readonly port: number;

	constructor(
		@Inject(APP_CONFIG_TOKEN)
		private readonly appConfig: ConfigType<AppConfig>,
	) {
		this.plaidClientName = this.appConfig.plaidClientName;
		this.plaidTransactionSyncCount = +this.appConfig.plaidTransactionSyncCount;

		this.plaidTransactionSyncOnFailureDelay =
			+this.plaidTransactionSyncOnFailureDelay;

		this.port = Number.parseInt(this.appConfig.port);
	}

	public isDev() {
		return this.appConfig.env === AppEnv.Development;
	}

	public isProd() {
		return this.appConfig.env === AppEnv.Production;
	}
}
