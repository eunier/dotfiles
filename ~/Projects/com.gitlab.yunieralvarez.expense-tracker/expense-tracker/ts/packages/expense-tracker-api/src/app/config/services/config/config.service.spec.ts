import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from '~/app/config/services/app-config/app-config.service';
import { Config } from '~/app/config/services/config/config.service';
import { JwtConfigService } from '~/app/config/services/jwt-config/jwt-config.service';
import { PlaidConfigService } from '~/app/config/services/plaid-config/plaid-config.service';
import { PostgresConfigService } from '~/app/config/services/postgres-config/postgres-config.service';

describe('Config', () => {
	let service: Config;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				Config,
				{ provide: AppConfigService, useValue: {} },
				{ provide: JwtConfigService, useValue: {} },
				{ provide: PlaidConfigService, useValue: {} },
				{ provide: PostgresConfigService, useValue: {} },
			],
		}).compile();

		service = module.get<Config>(Config);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
