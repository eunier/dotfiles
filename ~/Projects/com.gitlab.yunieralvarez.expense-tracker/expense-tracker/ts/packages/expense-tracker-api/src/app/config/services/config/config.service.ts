import { Injectable } from '@nestjs/common';
import { AppConfigService } from '~/app/config/services/app-config/app-config.service';
import { JwtConfigService } from '~/app/config/services/jwt-config/jwt-config.service';
import { PlaidConfigService } from '~/app/config/services/plaid-config/plaid-config.service';
import { PostgresConfigService } from '~/app/config/services/postgres-config/postgres-config.service';

@Injectable()
export class Config {
	constructor(
		public readonly app: AppConfigService,
		public readonly jwt: JwtConfigService,
		public readonly plaid: PlaidConfigService,
		public readonly postgres: PostgresConfigService,
	) {}
}
