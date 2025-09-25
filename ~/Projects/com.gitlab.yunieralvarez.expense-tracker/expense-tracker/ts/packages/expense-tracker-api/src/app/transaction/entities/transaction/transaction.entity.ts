import {
	Entity,
	EntityRepositoryType,
	ManyToOne,
	Property,
} from '@mikro-orm/core';
import { AccountEntity } from '~/app/account/entities/account/account.entity';
import { BaseEntity } from '~/app/orm/entities/base/base.entity';
import { PlaidLib } from '~/app/plaid/libs/plaid.lib';
import { TransactionRepository } from '~/app/transaction/repositories/transaction/transaction.repository';

@Entity({
	tableName: TransactionEntity.metadata.tableName,

	repository: TransactionEntity.metadata.repositoryFn,
})
export class TransactionEntity extends BaseEntity {
	public static metadata = {
		repository: TransactionRepository,
		repositoryFn: () => TransactionEntity.metadata.repository,
		tableName: 'transaction',
	};

	[EntityRepositoryType]? = TransactionEntity.metadata.repository;

	@Property()
	public amount: number;

	@Property({ nullable: true })
	public currencyCode?: string | null;

	@Property({ nullable: true })
	public category?: string;

	@Property()
	public merchantName: string;

	@Property()
	public date: Date;

	@Property({ nullable: true })
	public authorizedDate?: Date | null;

	@Property()
	public transactionId: string;

	@Property()
	public plaidAccountId: string;

	@Property({ nullable: true })
	public pendingPlaidTransactionId?: string | null;

	@ManyToOne(() => AccountEntity)
	public account: AccountEntity;

	public constructor(
		args?: Pick<
			TransactionEntity,
			| 'account'
			| 'amount'
			| 'authorizedDate'
			| 'category'
			| 'currencyCode'
			| 'date'
			| 'merchantName'
			| 'pendingPlaidTransactionId'
			| 'plaidAccountId'
			| 'transactionId'
		>,
	) {
		super();
		if (args) Object.assign(this, args);
	}

	public static fromPlaidTransaction(
		transaction: PlaidLib.Transaction,
		account: AccountEntity,
	) {
		const data = TransactionEntity.mapFromPlaidTransaction(
			transaction,
			account,
		);

		const transactionEntity = new TransactionEntity({
			amount: data.amount,
			merchantName: data.merchantName,
			date: data.date,
			transactionId: data.transactionId,
			plaidAccountId: data.plaidAccountId,
			account: account,
			authorizedDate: data.authorizedDate,
			category: data.category,
			currencyCode: data.currencyCode,
			pendingPlaidTransactionId: data.pendingPlaidTransactionId,
		});

		return transactionEntity;
	}

	public static updateFromPlaidTransaction(
		entity: TransactionEntity,
		transaction: PlaidLib.Transaction,
	) {
		const data = TransactionEntity.mapFromPlaidTransaction(transaction);
		entity.amount = data.amount;
		entity.authorizedDate = data.authorizedDate;
		entity.category = data.category;
		entity.currencyCode = data.currencyCode;
		entity.date = data.date;
		entity.merchantName = data.merchantName;
		entity.pendingPlaidTransactionId = data.pendingPlaidTransactionId;
		entity.plaidAccountId = data.plaidAccountId;
		entity.transactionId = data.transactionId;
	}

	private static mapFromPlaidTransaction(
		transaction: PlaidLib.Transaction,
		account?: AccountEntity,
	) {
		return {
			account: account,
			currencyCode: transaction.iso_currency_code,
			category: transaction.personal_finance_category?.primary,
			merchantName: transaction.merchant_name ?? transaction.name,
			date: new Date(transaction.date),
			authorizedDate: transaction.authorized_date
				? new Date(transaction.authorized_date)
				: null,
			transactionId: transaction.transaction_id,
			plaidAccountId: transaction.account_id,
			pendingPlaidTransactionId: transaction.pending_transaction_id,
			amount: transaction.amount,
		} satisfies Partial<TransactionEntity>;
	}
}
