import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { AccountEntity } from '~/app/account/entities/account/account.entity';
import { AccountRepository } from '~/app/account/repositories/account/account.repository';
import { Config } from '~/app/config/services/config/config.service';
import { PlaidLib } from '~/app/plaid/libs/plaid.lib';
import { TransactionFetchResponse } from '~/app/plaid/models/fetch-transactions-response/transaction-fetch-response.model';
import { PlaidService } from '~/app/plaid/services/plaid/plaid.service';
import { SourceEntity } from '~/app/source/entities/source/source.entity';
import { SourceRepository } from '~/app/source/repositories/source/source.service';
import { TransactionEntity } from '~/app/transaction/entities/transaction/transaction.entity';
import { TransactionRepository } from '~/app/transaction/repositories/transaction/transaction.repository';
import { UserEntity } from '~/app/user/entities/user/user.entity';
import { Utils } from '~/app/utils/services/utils/utils.service';

@Injectable()
export class TransactionService {
	private readonly logger = new Logger(TransactionService.name);

	public constructor(
		private readonly accountRepository: AccountRepository,
		private readonly config: Config,
		private readonly entityManager: EntityManager,
		private readonly plaidService: PlaidService,
		private readonly sourceRepository: SourceRepository,
		private readonly transactionRepository: TransactionRepository,
		private readonly utils: Utils,
	) {}

	/**
	 * Save fetched transactions for a user.
	 * @param userId The user id.
	 */
	public async syncTransactions(userId: string) {
		const sources = await this.sourceRepository.findAll({
			where: { user: { id: userId } },
		});

		this.logger.verbose(
			`Found ${sources.length} ${SourceEntity.name}(s) for ${UserEntity.name}.id: ${userId}`,
		);

		await this.syncSourcesTransactions(sources);
		await this.entityManager.flush();
	}

	public async removeTransactions(userId: string) {
		const sources = await this.sourceRepository.findAll({
			where: { user: { id: { $eq: userId } } },
			populate: ['accounts.transactions'],
		});

		let accountCount = 0;
		let transactionCount = 0;
		const transactions: TransactionEntity[] = [];

		for (const source of sources) {
			source.transactionCursor = undefined;
			accountCount += source.accounts.length;

			for (const account of source.accounts) {
				transactionCount += account.transactions.length;
				transactions.push(...account.transactions);
			}
		}

		this.logger.debug(
			`Found ${sources.length} sources for user ${userId}, with ${accountCount} accounts, and ${transactionCount} transactions`,
		);

		await this.entityManager.removeAndFlush(transactions);

		this.logger.debug(
			`Removed ${transactions.length} transactions and sources cursor for user ${userId},`,
		);
	}

	/**
	 * Sync all transactions for all passed sources.
	 * @param sources Sources to get transactions synced.
	 * @param retriesLeft Number of retry left.
	 * @param retryError The previous retry error.
	 */
	private async syncSourcesTransactions(
		sources: SourceEntity[],
		retriesLeft = 3,
		retryError: unknown = null,
	) {
		if (retriesLeft <= 0) {
			this.logger.error(
				"Too many retries trying to sync sources' transactions",
			);

			throw retryError;
		}

		for (const source of sources) {
			try {
				const transactionFetchResponse =
					await this.plaidService.fetchTransactions(
						source.accessToken,
						source.transactionCursor,
					);

				await this.syncSourceTransactions(transactionFetchResponse);
				source.transactionCursor = transactionFetchResponse.transactionCursor;
				this.entityManager.persist(source);
			} catch (err) {
				this.logger.error(
					`Error while syncing transactions for source id: ${source.id}`,
					err,
				);

				await this.utils.delay(
					this.config.app.plaidTransactionSyncOnFailureDelay,
				);

				await this.syncSourcesTransactions(sources, retriesLeft - 1, err);
			}
		}
	}

	/**
	 * Sync all transactions for a source.
	 * @param transactionFetchResponse Plaid sync transactions response.
	 */
	private async syncSourceTransactions(
		transactionFetchResponse: TransactionFetchResponse,
	) {
		const plaidAccountIds = [
			...new Set(
				[
					transactionFetchResponse.added,
					transactionFetchResponse.modified,
				].flatMap((transactions) =>
					transactions.map((transaction) => transaction.account_id),
				),
			),
		];

		this.logger.verbose(
			`Fetched transaction(s) corresponds to ${plaidAccountIds.length} plaid accounts(s)`,
		);

		const accountEntities = await this.accountRepository.findAll({
			where: { plaidId: { $in: plaidAccountIds } },
		});

		this.logger.verbose(
			`Fetched transaction(s) corresponds to ${accountEntities.length} accounts(s)`,
		);

		this.syncAddedTransactions(transactionFetchResponse.added, accountEntities);

		const currentTransactionEntities = await this.transactionRepository.findAll(
			{
				where: {
					transactionId: {
						$in: [
							transactionFetchResponse.modified.map((t) => t.transaction_id),
							transactionFetchResponse.removed.map((t) => t.transaction_id),
						].flat(),
					},
				},
			},
		);

		this.syncModifiedTransactions(
			transactionFetchResponse.modified,
			currentTransactionEntities,
		);

		this.syncRemovedTransactions(
			transactionFetchResponse.removed,
			currentTransactionEntities,
		);
	}

	/**
	 * Sync all added transactions.
	 * @param added Plaid sync transaction added response.
	 * @param accounts Accounts entries of the fetched transactions from Plaid.
	 */
	private syncAddedTransactions(
		added: PlaidLib.Transaction[],
		accounts: AccountEntity[],
	) {
		const newTransactions = added
			.map((t) => {
				const accountEntity = accounts.find((a) => a.plaidId === t.account_id);

				if (!accountEntity) return null;
				return TransactionEntity.fromPlaidTransaction(t, accountEntity);
			})
			.filter((t) => !!t);

		this.entityManager.persist(newTransactions);
		this.logger.verbose(`Creating ${newTransactions.length} transaction(s)...`);
	}

	/**
	 * Sync all modified transactions.
	 * @param modified Plaid sync transaction modified response.
	 * @param current Current transactions to be updated.
	 */
	private syncModifiedTransactions(
		modified: PlaidLib.Transaction[],
		current: TransactionEntity[],
	) {
		for (const m of modified) {
			const c = current.find((t) => t.transactionId === m.transaction_id);

			if (!c) {
				this.logger.error(
					`Got a modified transaction for a transaction that does not exist. Transaction id: ${m.transaction_id}`,
				);

				continue;
			}

			if (c.account.plaidId === m.account_id) {
				TransactionEntity.updateFromPlaidTransaction(c, m);
				this.entityManager.persist(c);
			} else {
				this.logger.error(
					`Got a modified transaction for a unexpected account. Modified plaid transaction account id: ${m.account_id}, expected plaid account id: ${c.account.id}`,
				);
			}
		}

		this.logger.verbose(`Updating ${current.length} transaction(s)...`);
	}

	/**
	 * Syn call removed transactions.
	 * @param removed Plaid sync transaction removed response.
	 * @param current Current transactions to be updated.
	 */
	private syncRemovedTransactions(
		removed: PlaidLib.RemovedTransaction[],
		current: TransactionEntity[],
	) {
		for (const r of removed) {
			const c = current.find((t) => t.transactionId === r.transaction_id);

			if (!c) {
				this.logger.error(
					`Got a removed transaction for a transaction that does not exist. Transaction id: ${r.transaction_id}`,
				);

				continue;
			}

			this.entityManager.remove(
				this.entityManager.getReference(TransactionEntity, c.id),
			);
		}

		this.logger.verbose(`Deleting ${removed.length} transaction(s)...`);
	}
}
