import { faker } from '@faker-js/faker/.';
import { ExchangePublicTokenResponse } from '~/app/plaid/models/exchange-public-token-response/exchange-public-token-response.model';
import { Utils } from '~/app/utils/services/utils/utils.service';

beforeEach(() => {
	faker.seed(
		Utils.genSeedFromString(
			expect.getState().currentTestName ?? ExchangePublicTokenResponse.name,
		),
	);
});

describe('ExchangePublicTokenResponse', () => {
	it('should be defined', () => {
		expect(
			new ExchangePublicTokenResponse(
				faker.lorem.text(),
				faker.string.nanoid(),
				faker.string.nanoid(),
			),
		).toBeDefined();
	});
});
