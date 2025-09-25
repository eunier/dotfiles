import { AppEnv } from '../enums/app-env.enum';

export interface AppConfigFactory {
	readonly env: AppEnv;
	readonly plaidClientName: string;
	readonly plaidTransactionSyncCount: string;
	readonly plaidTransactionSyncOnFailureDelay: string;
	readonly port: string;
}
