import { faker } from '@faker-js/faker/.';
import { Collection, EntityManager } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, mockDeep } from 'jest-mock-extended';
import { AccountEntity } from '~/app/account/entities/account/account.entity';
import { AccountRepository } from '~/app/account/repositories/account/account.repository';
import { AppConfigService } from '~/app/config/services/app-config/app-config.service';
import { Config } from '~/app/config/services/config/config.service';
import { mikroOrmTestOptions } from '~/app/orm/options/mikro-orm.options';
import { OrmModule } from '~/app/orm/orm.module';
import { PlaidLib } from '~/app/plaid/libs/plaid.lib';
import { TransactionFetchResponse } from '~/app/plaid/models/fetch-transactions-response/transaction-fetch-response.model';
import { PlaidService } from '~/app/plaid/services/plaid/plaid.service';
import { SourceEntity } from '~/app/source/entities/source/source.entity';
import { SourceRepository } from '~/app/source/repositories/source/source.service';
import { TransactionEntity } from '~/app/transaction/entities/transaction/transaction.entity';
import { TransactionRepository } from '~/app/transaction/repositories/transaction/transaction.repository';
import { TransactionService } from '~/app/transaction/services/transaction/transaction.service';
import { Utils } from '~/app/utils/services/utils/utils.service';
import { RecursivePartial } from '~/app/utils/types/recursive-partial.type';
import { UtilsModule } from '~/app/utils/utils.module';

describe('TransactionService', () => {
	let transactionService: TransactionService;
	let entityManager: EntityManager;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule.forRoot(mikroOrmTestOptions), UtilsModule],
			providers: [
				TransactionService,
				{ provide: AccountRepository, useValue: mock<AccountRepository>() },
				{ provide: PlaidService, useValue: mock(PlaidService) },
				{ provide: SourceRepository, useValue: mock(SourceRepository) },
				{
					provide: TransactionRepository,
					useValue: mock<TransactionRepository>(),
				},
				{ provide: Config, useValue: mock<Config>() },
			],
		}).compile();

		transactionService = module.get<TransactionService>(TransactionService);
		entityManager = module.get<EntityManager>(EntityManager);

		faker.seed(
			Utils.genSeedFromString(
				expect.getState().currentTestName ?? TransactionService.name,
			),
		);

		jest.useFakeTimers();

		jest.setSystemTime(
			new Date(faker.number.int({ min: 1970, max: 2000 }), 1, 1),
		);
	});

	describe('syncAddedTransactions', () => {
		it('should persist new transactions', () => {
			const accountIds = Array.from(Utils.range(3)).map(() =>
				faker.string.nanoid(),
			);

			const accounts = accountIds.map((id) => {
				const account = mock<AccountEntity>();
				account.id = faker.string.uuid();
				account.plaidId = id;
				return account;
			});

			const transactions = accounts.map((account, idx) => {
				const transaction = mockDeep<PlaidLib.Transaction>();

				transaction.account_id = account.plaidId;
				transaction.iso_currency_code = faker.finance.currencyCode();

				transaction.personal_finance_category!.primary =
					faker.commerce.department();

				transaction.merchant_name = [
					faker.company.name(),
					faker.company.name(),
					null,
				][idx];

				transaction.name = faker.company.name();
				transaction.date = faker.date.past().toISOString();

				transaction.authorized_date = [
					faker.date.past().toISOString(),
					faker.date.past().toISOString(),
					null,
				][idx];

				transaction.transaction_id = faker.string.nanoid();
				transaction.pending_transaction_id = faker.string.nanoid();
				transaction.amount = faker.number.int({ min: 1, max: 1000 });

				return transaction;
			});

			const entityManagerPersisSpy = jest.spyOn(entityManager, 'persist');
			transactionService['syncAddedTransactions'](transactions, accounts);

			const entityManagerPersisArg = (
				entityManagerPersisSpy.mock.calls[0][0] as TransactionEntity[]
			).map((t) => Utils.inspectObject(t));

			expect(entityManagerPersisArg).toMatchSnapshot();
		});

		describe('when no matching account is found', () => {
			it('should not persist the transaction', () => {
				const accountIds = Array.from(Utils.range(3)).map(() =>
					faker.string.nanoid(),
				);

				const accounts = accountIds.map((id) => {
					const account = mock<AccountEntity>();
					account.id = faker.string.uuid();
					account.plaidId = id;
					return account;
				});

				const transactions = accounts.map((account, idx) => {
					const transaction = mockDeep<PlaidLib.Transaction>();

					// Simulate a transaction with a different account_id
					// to test the case where no matching account is found
					transaction.account_id = faker.string.nanoid();

					transaction.iso_currency_code = faker.finance.currencyCode();

					transaction.personal_finance_category!.primary =
						faker.commerce.department();

					transaction.merchant_name = [
						faker.company.name(),
						faker.company.name(),
						null,
					][idx];

					transaction.name = faker.company.name();
					transaction.date = faker.date.past().toISOString();

					transaction.authorized_date = [
						faker.date.past().toISOString(),
						faker.date.past().toISOString(),
						null,
					][idx];

					transaction.transaction_id = faker.string.nanoid();
					transaction.pending_transaction_id = faker.string.nanoid();
					transaction.amount = faker.number.int({ min: 1, max: 1000 });

					return transaction;
				});

				const entityManagerPersisSpy = jest.spyOn(entityManager, 'persist');
				transactionService['syncAddedTransactions'](transactions, accounts);

				const entityManagerPersisArg = (
					entityManagerPersisSpy.mock.calls[0][0] as TransactionEntity[]
				).map((t) => Utils.inspectObject(t));

				expect(entityManagerPersisArg).toMatchSnapshot();
			});
		});
	});

	describe('syncModifiedTransactions', () => {
		describe('when a matching current transaction is not found', () => {
			it('should log a error', () => {
				const modified = Array.from(Utils.range(3)).map(() => {
					const transaction = mock<PlaidLib.Transaction>();
					transaction.transaction_id = faker.string.nanoid();
					return transaction;
				});

				const current = Array.from(Utils.range(3)).map(() => {
					const transaction = mock<TransactionEntity>();
					transaction.id = faker.string.uuid();
					transaction.transactionId = faker.string.nanoid();
					return transaction;
				});

				const loggerErrorSpy = jest.spyOn(
					transactionService['logger'],
					'error',
				);

				transactionService['syncModifiedTransactions'](modified, current);

				expect(loggerErrorSpy.mock.calls).toEqual([
					// spell-checker: disable
					[
						'Got a modified transaction for a transaction that does not exist. Transaction id: iXl-a-vYCbprAKa5GCXDi',
					],
					[
						'Got a modified transaction for a transaction that does not exist. Transaction id: 0T1RNYjn1LGACRoL_wONd',
					],
					[
						'Got a modified transaction for a transaction that does not exist. Transaction id: Y9q4VQHSud1axsJW3R_ar',
					],
					// spell-checker: enable
				]);
			});
		});

		describe('when a matching current transaction is found', () => {
			describe('when the current transaction match the modified transaction account id', () => {
				it('should update the current transaction', () => {
					const modified = Array.from(Utils.range(3)).map(() => {
						const transaction = mock<PlaidLib.Transaction>();
						transaction.transaction_id = faker.string.nanoid();
						transaction.account_id = faker.string.nanoid();
						transaction.merchant_name = `New: ${faker.company.name()}`;
						return transaction;
					});

					const current = modified.map((m) => {
						const transaction = mockDeep<TransactionEntity>();
						transaction.id = faker.string.uuid();
						transaction.account.plaidId = m.account_id;
						transaction.transactionId = m.transaction_id;
						transaction.account.id = faker.string.uuid();
						transaction.merchantName = `Old: ${faker.company.name()}`;
						return transaction;
					});

					const persistSpy = jest
						.spyOn(entityManager, 'persist')
						.mockImplementation();

					transactionService['syncModifiedTransactions'](modified, current);

					const persistArg = persistSpy.mock.calls.map((t) =>
						Utils.inspectObject(t),
					);

					expect(persistArg).toMatchSnapshot();
				});
			});

			describe('when the current transaction does not match the modified transaction account id', () => {
				it('should log a error message', () => {
					const modified = Array.from(Utils.range(3)).map(() => {
						const transaction = mock<PlaidLib.Transaction>();
						transaction.transaction_id = faker.string.nanoid();
						transaction.account_id = faker.string.nanoid();
						transaction.merchant_name = `New: ${faker.company.name()}`;
						return transaction;
					});

					const current = modified.map((m) => {
						const transaction = mockDeep<TransactionEntity>();
						transaction.id = faker.string.uuid();

						// Simulate a different account_id
						transaction.account.plaidId = faker.string.nanoid();

						transaction.transactionId = m.transaction_id;
						transaction.account.id = faker.string.uuid();
						transaction.merchantName = `Old: ${faker.company.name()}`;
						return transaction;
					});

					const loggerSpy = jest
						.spyOn(transactionService['logger'], 'error')
						.mockImplementation();

					transactionService['syncModifiedTransactions'](modified, current);

					expect(loggerSpy.mock.calls).toEqual([
						// spell-checker: disable
						[
							'Got a modified transaction for a unexpected account. Modified plaid transaction account id: XCINsFmlUIn9yuRbihl-X, expected plaid account id: a18b9aff-b38b-4288-ac11-72931cefeb5c',
						],
						[
							'Got a modified transaction for a unexpected account. Modified plaid transaction account id: LYbtJWCWlK5JOkxlfKqyp, expected plaid account id: 7fedf98b-b8dc-45a0-809e-1f2f53ca21ef',
						],
						[
							'Got a modified transaction for a unexpected account. Modified plaid transaction account id: j0W9wA43KUF5YWwwTN8h8, expected plaid account id: d6387e5b-92be-4b8f-b106-73dab5c32f76',
						],
						// spell-checker: enable
					]);
				});

				it('should not persist the transaction entity', () => {
					const modified = Array.from(Utils.range(3)).map(() => {
						const transaction = mock<PlaidLib.Transaction>();
						transaction.transaction_id = faker.string.nanoid();
						transaction.account_id = faker.string.nanoid();
						transaction.merchant_name = `New: ${faker.company.name()}`;
						return transaction;
					});

					const current = modified.map((m) => {
						const transaction = mockDeep<TransactionEntity>();
						transaction.id = faker.string.uuid();

						// Simulate a different account_id
						transaction.account.plaidId = faker.string.nanoid();

						transaction.transactionId = m.transaction_id;
						transaction.account.id = faker.string.uuid();
						transaction.merchantName = `Old: ${faker.company.name()}`;
						return transaction;
					});

					const persistSpy = jest
						.spyOn(entityManager, 'persist')
						.mockImplementation();

					transactionService['syncModifiedTransactions'](modified, current);
					expect(persistSpy).not.toHaveBeenCalled();
				});
			});
		});
	});

	describe('syncRemovedTransactions', () => {
		describe('when no matching current transaction is found', () => {
			it('should log a error message', () => {
				const removed = Array.from(Utils.range(3)).map((id) => {
					const transaction = mock<PlaidLib.RemovedTransaction>();
					transaction.transaction_id = faker.string.nanoid();
					return transaction;
				});

				const current = Array.from(Utils.range(3)).map(() => {
					const transaction = mock<TransactionEntity>();
					transaction.id = faker.string.uuid();
					// Simulate a different transactionId
					transaction.transactionId = faker.string.nanoid();
					return transaction;
				});

				const loggerSpy = jest.spyOn(transactionService['logger'], 'error');
				transactionService['syncRemovedTransactions'](removed, current);
				expect(loggerSpy.mock.calls).toMatchSnapshot();
			});

			it('should not try to remove any transaction', () => {
				const removed = Array.from(Utils.range(3)).map((id) => {
					const transaction = mock<PlaidLib.RemovedTransaction>();
					transaction.transaction_id = faker.string.nanoid();
					return transaction;
				});

				const current = Array.from(Utils.range(3)).map(() => {
					const transaction = mock<TransactionEntity>();
					transaction.id = faker.string.uuid();
					// Simulate a different transactionId
					transaction.transactionId = faker.string.nanoid();
					return transaction;
				});

				const removeSpy = jest.spyOn(entityManager, 'remove');
				transactionService['syncRemovedTransactions'](removed, current);
				expect(removeSpy).not.toHaveBeenCalled();
			});
		});

		describe('when matching current transaction is found', () => {
			it('should remove the transaction', () => {
				const removed = Array.from(Utils.range(3)).map(() => {
					const transaction = mock<PlaidLib.RemovedTransaction>();
					transaction.transaction_id = faker.string.nanoid();
					return transaction;
				});

				const current = removed.map((r) => {
					const transaction = mockDeep<TransactionEntity>();
					transaction.id = faker.string.uuid();
					// Simulate a matching transactionId
					transaction.transactionId = r.transaction_id;
					return transaction;
				});

				const removeSpy = jest.spyOn(entityManager, 'remove');
				transactionService['syncRemovedTransactions'](removed, current);

				const removeArg = removeSpy.mock.calls.map((t) =>
					Utils.inspectObject(t),
				);

				expect(removeSpy).toHaveBeenCalled();
				expect(removeArg).toMatchSnapshot();
			});
		});
	});
});

describe('TransactionService (legacy)', () => {
	let transactionService: TransactionService;
	let sourceRepository: SourceRepository;
	let entityManager: EntityManager;
	let plaidService: PlaidService;
	let utils: Utils;
	let accountRepository: AccountRepository;
	let transactionRepository: TransactionRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule.forRoot(mikroOrmTestOptions), UtilsModule],
			providers: [
				TransactionService,
				{
					provide: AccountRepository,
					useValue: { findAll: jest.fn() } satisfies Partial<AccountRepository>,
				},
				{
					provide: PlaidService,
					useValue: {
						fetchTransactions: jest.fn(),
					} satisfies Partial<PlaidService>,
				},
				{
					provide: SourceRepository,
					useValue: { findAll: jest.fn() } satisfies Partial<SourceRepository>,
				},
				{
					provide: TransactionRepository,
					useValue: {
						findAll: jest.fn(),
					} satisfies Partial<TransactionRepository>,
				},
				{
					provide: Config,
					useValue: {
						app: {
							plaidTransactionSyncOnFailureDelay: 1,
						} satisfies Partial<AppConfigService> as AppConfigService,
					} satisfies Partial<Config>,
				},
			],
		}).compile();

		transactionService = module.get<TransactionService>(TransactionService);
		sourceRepository = module.get<SourceRepository>(SourceRepository);
		entityManager = module.get<EntityManager>(EntityManager);
		plaidService = module.get<PlaidService>(PlaidService);
		utils = module.get<Utils>(Utils);
		accountRepository = module.get<AccountRepository>(AccountRepository);
		transactionRepository = module.get<TransactionRepository>(
			TransactionRepository,
		);

		faker.seed(
			Utils.genSeedFromString(
				expect.getState().currentTestName ?? TransactionService.name,
			),
		);

		jest.useFakeTimers();

		jest.setSystemTime(
			new Date(faker.number.int({ min: 1970, max: 2000 }), 1, 1),
		);
	});

	afterEach(() => {
		entityManager.clear();
	});

	it('should be defined', () => {
		expect(transactionService).toBeDefined();
	});

	describe('syncTransactions', () => {
		it('should call syncSourcesTransactions', async () => {
			const sources = Array.from(Utils.range(3)).map(() => {
				const source = new SourceEntity();
				source.id = faker.string.uuid();
				return source;
			});

			jest.spyOn(sourceRepository, 'findAll').mockResolvedValue(sources);
			transactionService['syncSourcesTransactions'] = jest.fn();

			const spy = jest.spyOn(
				transactionService,
				'syncSourcesTransactions' as keyof TransactionService,
			);

			await transactionService.syncTransactions(faker.string.uuid());
			expect(spy).toHaveBeenCalledWith(sources);
		});

		it('should call entityManager.flush', async () => {
			const sources = Array.from(Utils.range(3)).map(() => {
				const source = new SourceEntity();
				source.id = faker.string.uuid();
				return source;
			});

			jest.spyOn(sourceRepository, 'findAll').mockResolvedValue(sources);
			transactionService['syncSourcesTransactions'] = jest.fn();

			const spy = jest.spyOn(
				transactionService,
				'syncSourcesTransactions' as keyof TransactionService,
			);

			entityManager.flush = jest.fn();
			const entityManagerFlushSpy = jest.spyOn(entityManager, 'flush');

			await transactionService.syncTransactions(faker.string.uuid());
			expect(entityManagerFlushSpy).toHaveBeenCalled();
		});
	});

	describe('syncSourcesTransactions', () => {
		it('should throw if called with retriesLeft as 0 or less', async () => {
			try {
				await transactionService['syncSourcesTransactions'](
					[],
					0,
					new Error(faker.lorem.sentence()),
				);

				fail('should throw an error');
			} catch (err) {
				expect(err).toBeInstanceOf(Error);

				expect((err as Error).message).toBe(
					// spell-checker: disable-next-line
					'Aduro quae iure temeritas eos cupressus magnam.',
				);
			}
		});

		it('should throw is retries are exhausted', async () => {
			jest
				.spyOn(plaidService, 'fetchTransactions')
				.mockRejectedValue(new Error(faker.lorem.sentence()));

			jest.spyOn(utils, 'delay').mockResolvedValue();

			try {
				await transactionService['syncSourcesTransactions'](
					Array.from(Utils.range(3)).map(() => new SourceEntity()),
				);

				fail('should throw an error');
			} catch (err) {
				expect(err).toBeInstanceOf(Error);

				expect((err as Error).message).toBe(
					// spell-checker: disable-next-line
					'Asperiores vicinus carus conor amaritudo cetera.',
				);
			}
		});

		it('should call syncSourceTransactions', async () => {
			jest.spyOn(plaidService, 'fetchTransactions').mockResolvedValue({
				added: [],
				modified: [],
				removed: [],
				transactionCursor: faker.string.nanoid(),
			});

			const syncSourceTransactionsSpy = jest
				.spyOn(
					transactionService,
					'syncSourceTransactions' as keyof TransactionService,
				)
				.mockImplementation();

			await transactionService['syncSourcesTransactions']([new SourceEntity()]);

			expect(syncSourceTransactionsSpy).toHaveBeenCalledWith({
				added: [],
				modified: [],
				removed: [],
				transactionCursor:
					// spell-checker: disable-next-line
					'DgHWaFUKZ0CaW5Blw-dlp',
			});
		});

		it('should call entityManager.persist with source', async () => {
			jest.spyOn(plaidService, 'fetchTransactions').mockResolvedValue({
				added: [],
				modified: [],
				removed: [],
				transactionCursor: faker.string.nanoid(),
			});

			jest
				.spyOn(
					transactionService,
					'syncSourceTransactions' as keyof TransactionService,
				)
				.mockImplementation();

			const entityManagerPersistSpy = jest
				.spyOn(entityManager, 'persist')
				.mockImplementation();

			await transactionService['syncSourcesTransactions']([new SourceEntity()]);

			const entityManagerPersistArg = entityManagerPersistSpy.mock
				.calls[0][0] as SourceEntity;

			expect(entityManagerPersistArg).toBeInstanceOf(SourceEntity);
			expect(entityManagerPersistArg).toMatchSnapshot();
		});
	});

	describe('syncSourceTransactions', () => {
		it('should call syncAddedTransactions', async () => {
			const accountIds = Array.from(Utils.range(2)).map(() =>
				faker.string.nanoid(),
			);

			const accounts = accountIds.map(
				(id) =>
					({
						id: faker.string.uuid(),
						plaidId: id,
					}) satisfies RecursivePartial<AccountEntity>,
			);

			jest.spyOn(accountRepository, 'findAll').mockResolvedValue(accounts);
			jest.spyOn(transactionRepository, 'findAll').mockResolvedValue([]);

			const syncAddedTransactionsSpy = jest
				.spyOn(
					transactionService,
					'syncAddedTransactions' as keyof TransactionService,
				)
				.mockImplementation();

			jest
				.spyOn(
					transactionService,
					'syncModifiedTransactions' as keyof TransactionService,
				)
				.mockImplementation();

			jest
				.spyOn(
					transactionService,
					'syncRemovedTransactions' as keyof TransactionService,
				)
				.mockImplementation();

			const transactionFetchResponse = {
				added: [
					{
						account_id: accountIds[0],
					},
					{
						account_id: accountIds[1],
					},
				],
				modified: [
					{
						account_id: accountIds[0],
					},
					{
						account_id: accountIds[1],
					},
				],
				removed: [
					{
						account_id: accountIds[0],
					},
					{
						account_id: accountIds[1],
					},
				],
				transactionCursor: faker.string.nanoid(),
			} satisfies RecursivePartial<TransactionFetchResponse> as TransactionFetchResponse;

			await transactionService['syncSourceTransactions'](
				transactionFetchResponse,
			);

			const syncAddedTransactionsArg = syncAddedTransactionsSpy.mock
				.calls[0][0] as unknown as PlaidLib.Transaction[];

			expect(syncAddedTransactionsArg).toMatchSnapshot();
		});

		it('should call syncModifiedTransactions', async () => {
			const accountIds = Array.from(Utils.range(2)).map(() =>
				faker.string.nanoid(),
			);

			const accounts = accountIds.map(
				(id) =>
					({
						id: faker.string.uuid(),
						plaidId: id,
					}) satisfies RecursivePartial<AccountEntity>,
			);

			jest.spyOn(accountRepository, 'findAll').mockResolvedValue(accounts);
			jest.spyOn(transactionRepository, 'findAll').mockResolvedValue([]);

			jest
				.spyOn(
					transactionService,
					'syncAddedTransactions' as keyof TransactionService,
				)
				.mockImplementation();

			const syncModifiedTransactionsSpy = jest
				.spyOn(
					transactionService,
					'syncModifiedTransactions' as keyof TransactionService,
				)
				.mockImplementation();

			jest
				.spyOn(
					transactionService,
					'syncRemovedTransactions' as keyof TransactionService,
				)
				.mockImplementation();

			const transactionFetchResponse = {
				added: [
					{
						account_id: accountIds[0],
					},
					{
						account_id: accountIds[1],
					},
				],
				modified: [
					{
						account_id: accountIds[0],
					},
					{
						account_id: accountIds[1],
					},
				],
				removed: [
					{
						account_id: accountIds[0],
					},
					{
						account_id: accountIds[1],
					},
				],
				transactionCursor: faker.string.nanoid(),
			} satisfies RecursivePartial<TransactionFetchResponse> as TransactionFetchResponse;

			await transactionService['syncSourceTransactions'](
				transactionFetchResponse,
			);

			const syncModifiedTransactionsArg = syncModifiedTransactionsSpy.mock
				.calls[0][0] as unknown as PlaidLib.Transaction[];

			expect(syncModifiedTransactionsArg).toMatchSnapshot();
		});

		it('should call syncRemovedTransactions', async () => {
			const accountIds = Array.from(Utils.range(2)).map(() =>
				faker.string.nanoid(),
			);

			const accounts = accountIds.map(
				(id) =>
					({
						id: faker.string.uuid(),
						plaidId: id,
					}) satisfies RecursivePartial<AccountEntity>,
			);

			jest.spyOn(accountRepository, 'findAll').mockResolvedValue(accounts);
			jest.spyOn(transactionRepository, 'findAll').mockResolvedValue([]);

			jest
				.spyOn(
					transactionService,
					'syncAddedTransactions' as keyof TransactionService,
				)
				.mockImplementation();

			jest
				.spyOn(
					transactionService,
					'syncModifiedTransactions' as keyof TransactionService,
				)
				.mockImplementation();

			const syncRemovedTransactionsSpy = jest
				.spyOn(
					transactionService,
					'syncRemovedTransactions' as keyof TransactionService,
				)
				.mockImplementation();

			const transactionFetchResponse = {
				added: [
					{
						account_id: accountIds[0],
					},
					{
						account_id: accountIds[1],
					},
				],
				modified: [
					{
						account_id: accountIds[0],
					},
					{
						account_id: accountIds[1],
					},
				],
				removed: [
					{
						account_id: accountIds[0],
					},
					{
						account_id: accountIds[1],
					},
				],
				transactionCursor: faker.string.nanoid(),
			} satisfies RecursivePartial<TransactionFetchResponse> as TransactionFetchResponse;

			await transactionService['syncSourceTransactions'](
				transactionFetchResponse,
			);

			const syncRemovedTransactionsArg = syncRemovedTransactionsSpy.mock
				.calls[0][0] as unknown as PlaidLib.Transaction[];

			expect(syncRemovedTransactionsArg).toMatchSnapshot();
		});
	});

	describe('removeTransactions', () => {
		it('should remove transactions for a user', async () => {
			const sources: RecursivePartial<SourceEntity>[] = [];

			for (const _ of Utils.range(3)) {
				const source = new SourceEntity();
				source.id = faker.string.uuid();
				source.accounts = new Collection(source);

				for (const _ of Utils.range(3)) {
					const account = new AccountEntity();
					account.id = faker.string.uuid();
					source.accounts.add(account);
					account.transactions = new Collection(account);

					for (const _ of Utils.range(3)) {
						const transaction = new TransactionEntity();
						transaction.id = faker.string.uuid();
						account.transactions.add(transaction);
					}
				}

				sources.push(source);
			}

			jest.spyOn(sourceRepository, 'findAll').mockResolvedValue(sources);

			const entityManagerRemoveAndFlushSpy = jest
				.spyOn(entityManager, 'removeAndFlush')
				.mockImplementation();

			await transactionService.removeTransactions(faker.string.nanoid());

			const entityManagerRemoveAndFlushSpyArg = entityManagerRemoveAndFlushSpy
				.mock.calls[0][0] as TransactionEntity[];

			expect(entityManagerRemoveAndFlushSpyArg).toMatchSnapshot();
		});
	});
});
