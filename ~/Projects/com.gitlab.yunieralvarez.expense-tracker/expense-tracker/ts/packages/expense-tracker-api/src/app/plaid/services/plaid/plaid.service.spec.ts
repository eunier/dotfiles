import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { AppConfigService } from '~/app/config/services/app-config/app-config.service';
import { Config } from '~/app/config/services/config/config.service';
import { PlaidConfigService } from '~/app/config/services/plaid-config/plaid-config.service';
import { PlaidLib } from '~/app/plaid/libs/plaid.lib';
import { ExchangePublicTokenResponse } from '~/app/plaid/models/exchange-public-token-response/exchange-public-token-response.model';
import { PLAID_API_CLASS_TOKEN } from '~/app/plaid/providers/plaid-api-class.provider';
import { Utils } from '~/app/utils/services/utils/utils.service';
import { PlaidService } from './plaid.service';

beforeEach(() => {
	jest.useFakeTimers();
	jest.setSystemTime(new Date(0).getTime());

	faker.seed(
		Utils.genSeedFromString(
			expect.getState().currentTestName ?? PlaidService.name,
		),
	);
});

describe('PlaidService', () => {
	let service: PlaidService;
	let config: Config;

	const plaidClient = {
		linkTokenCreate: jest.fn(),
		itemPublicTokenExchange: jest.fn(),
		institutionsGetById: jest.fn(),
		transactionsSync: jest.fn(),
	} satisfies Partial<PlaidLib.PlaidApi>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PlaidService,
				{
					provide: PLAID_API_CLASS_TOKEN,
					useValue: class implements Partial<PlaidLib.PlaidApi> {
						public linkTokenCreate = plaidClient.linkTokenCreate;
						public itemPublicTokenExchange =
							plaidClient.itemPublicTokenExchange;
						public institutionsGetById = plaidClient.institutionsGetById;
						public transactionsSync = plaidClient.transactionsSync;
					},
				},
				{
					provide: Config,
					useValue: {
						plaid: {
							clientId: faker.string.nanoid(),
							secret: faker.string.nanoid(),
							version: faker.date.anytime().toString(),
						} satisfies Partial<PlaidConfigService> as PlaidConfigService,
						app: {
							plaidTransactionSyncCount: faker.number.int(),
						} satisfies Partial<AppConfigService> as AppConfigService,
					} satisfies Partial<Config>,
				},
			],
		}).compile();

		service = module.get<PlaidService>(PlaidService);
		config = module.get<Config>(Config);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('createLinkToken', () => {
		it('should return link token', async () => {
			plaidClient.linkTokenCreate.mockResolvedValue({
				data: {
					link_token: faker.string.nanoid(),
				} as PlaidLib.LinkTokenCreateResponse,
			} satisfies Partial<
				AxiosResponse<PlaidLib.LinkTokenCreateResponse, unknown>
			>);

			const res = await service.createLinkToken(faker.string.uuid());
			expect(res.link_token).toEqual(
				// spell: disable-next-line
				'ZCMJ83P2eBMnfTBhAaccc',
			);
		});
	});

	describe('exchangePublicToken', () => {
		it('should return response', async () => {
			plaidClient.itemPublicTokenExchange.mockResolvedValue({
				data: {
					access_token: faker.string.nanoid(),
					item_id: faker.string.nanoid(),
					request_id: faker.string.nanoid(),
				} satisfies Partial<PlaidLib.ItemPublicTokenExchangeResponse> as PlaidLib.ItemPublicTokenExchangeResponse,
			} satisfies Partial<
				AxiosResponse<PlaidLib.ItemPublicTokenExchangeResponse, unknown>
			>);

			const res = await service.exchangePublicToken(faker.string.nanoid());

			expect(res).toEqual({
				// spell: disable
				accessToken: '7he5LkZtaCmGAcVCMYw5o',
				plaidId: 'N8ghj8-e28gOz6KfUWmA9',
				requestId: 'YR3Un1pxnnAEUJiXh6sbG',
				// spell: enable
			} satisfies Partial<ExchangePublicTokenResponse>);
		});
	});

	describe('getInstitutionById', () => {
		it('should return institution', async () => {
			plaidClient.institutionsGetById.mockResolvedValue({
				data: {
					institution: {
						name: faker.company.name(),
					} satisfies Partial<PlaidLib.Institution> as PlaidLib.Institution,
				} satisfies Partial<PlaidLib.InstitutionsGetByIdResponse> as PlaidLib.InstitutionsGetByIdResponse,
			} satisfies Partial<
				AxiosResponse<PlaidLib.InstitutionsGetByIdResponse, unknown>
			>);

			const res = await service.getInstitutionById(faker.string.nanoid());

			expect(res).toEqual({
				institution: {
					name:
						// spell: disable-next-line
						"D'Amore, Denesik and Witting",
				} satisfies Partial<PlaidLib.Institution> as PlaidLib.Institution,
			} satisfies Partial<PlaidLib.InstitutionsGetByIdResponse>);
		});
	});

	describe('fetchTransactions', () => {
		it('should return transactions', async () => {
			config.app.plaidTransactionSyncCount = 10;
			const added: PlaidLib.Transaction[] = [];
			const modified: PlaidLib.Transaction[] = [];
			const removed: PlaidLib.RemovedTransaction[] = [];

			const randomTransaction = ():
				| PlaidLib.Transaction
				| PlaidLib.RemovedTransaction => ({
				account_id: faker.string.nanoid(),
				amount: faker.number.float({ min: 0, max: 100 }),
				category: [faker.commerce.department()],
				date: faker.date.anytime().toString(),
				name: faker.company.name(),
				transaction_id: faker.string.nanoid(),
			});

			for (const _ of Utils.range(15)) {
				added.push(randomTransaction() as PlaidLib.Transaction);
				modified.push(randomTransaction() as PlaidLib.Transaction);
				removed.push(randomTransaction() as PlaidLib.RemovedTransaction);
			}

			plaidClient.transactionsSync
				.mockResolvedValueOnce({
					data: {
						added: added.slice(0, 10),
						modified: modified.slice(0, 10),
						removed: removed.slice(0, 10),
						next_cursor: faker.string.nanoid(),
						has_more: true,
					} satisfies Partial<PlaidLib.TransactionsSyncResponse> as unknown as PlaidLib.TransactionsSyncResponse,
				} satisfies Partial<
					AxiosResponse<PlaidLib.TransactionsSyncResponse, unknown>
				>)
				.mockResolvedValueOnce({
					data: {
						added: added.slice(10),
						modified: modified.slice(10),
						removed: removed.slice(10),
						next_cursor: faker.string.nanoid(),
						has_more: false,
					} satisfies Partial<PlaidLib.TransactionsSyncResponse> as unknown as PlaidLib.TransactionsSyncResponse,
				} satisfies Partial<
					AxiosResponse<PlaidLib.TransactionsSyncResponse, unknown>
				>);

			const res = await service.fetchTransactions(faker.string.nanoid());
			expect(res).toMatchSnapshot();
		});
	});
});
