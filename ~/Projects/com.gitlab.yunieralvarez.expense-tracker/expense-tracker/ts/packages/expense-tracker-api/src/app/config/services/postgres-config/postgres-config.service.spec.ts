import { faker } from '@faker-js/faker/.';
import { ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { POSTGRES_CONFIG_TOKEN } from '~/app/config/configs/postgres.config';
import { PostgresConfig } from '~/app/config/models/postgres-config.model';
import { PostgresConfigService } from '~/app/config/services/postgres-config/postgres-config.service';
import { Utils } from '~/app/utils/services/utils/utils.service';

beforeEach(() => {
	faker.seed(
		Utils.genSeedFromString(
			expect.getState().currentTestName ?? PostgresConfigService.name,
		),
	);
});

describe('PostgresConfigService', () => {
	let service: PostgresConfigService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PostgresConfigService,
				{
					provide: POSTGRES_CONFIG_TOKEN,
					useValue: {
						database: 'database-test',
						host: 'localhost',
						port: '1234',
						username: 'username-test',
						password: 'password-test',
					} satisfies Partial<ConfigType<PostgresConfig>>,
				},
			],
		}).compile();

		service = module.get<PostgresConfigService>(PostgresConfigService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
