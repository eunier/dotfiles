import { faker } from '@faker-js/faker/.';
import { ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Products } from 'plaid';
import { PLAID_CONFIG_TOKEN } from '~/app/config/configs/plaid.config';
import { PlaidConfig } from '~/app/config/models/plaid-config.model';
import { Utils } from '~/app/utils/services/utils/utils.service';
import { PlaidConfigService } from './plaid-config.service';

beforeEach(() => {
	faker.seed(
		Utils.genSeedFromString(
			expect.getState().currentTestName ?? PlaidConfigService.name,
		),
	);
});

describe('PlaidConfigService', () => {
	let service: PlaidConfigService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PlaidConfigService,
				{
					provide: PLAID_CONFIG_TOKEN,
					useValue: {
						clientId: faker.string.ulid(),
						countryCodes: `${faker.location.countryCode()},${faker.location.countryCode()}`,
						env: 'development',
						products: [Products.Auth, Products.Transactions].join(','),
						redirectUri: faker.internet.url(),
						secret: faker.string.ulid(),
						version: faker.date.past().toISOString(),
					} satisfies Partial<ConfigType<PlaidConfig>>,
				},
			],
		}).compile();

		service = module.get<PlaidConfigService>(PlaidConfigService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
