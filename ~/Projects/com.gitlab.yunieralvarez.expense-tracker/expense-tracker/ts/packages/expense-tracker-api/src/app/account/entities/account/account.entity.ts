import {
	Collection,
	Entity,
	EntityRepositoryType,
	ManyToOne,
	OneToMany,
	Property,
} from '@mikro-orm/core';
import { AccountRepository } from '~/app/account/repositories/account/account.repository';
import { ExchangePublicTokenRequestAccount } from '~/app/link/dto/exchange-public-token-request-account.dto';
import { BaseEntity } from '~/app/orm/entities/base/base.entity';
import { SourceEntity } from '~/app/source/entities/source/source.entity';
import { TransactionEntity } from '~/app/transaction/entities/transaction/transaction.entity';

@Entity({
	tableName: AccountEntity.metadata.tableName,
	repository: AccountEntity.metadata.repositoryFn,
})
export class AccountEntity extends BaseEntity {
	public static metadata = {
		repository: AccountRepository,
		repositoryFn: () => AccountEntity.metadata.repository,
		tableName: 'account',
	};

	[EntityRepositoryType]? = AccountEntity.metadata.repository;

	@Property()
	public plaidId: string;

	@Property()
	public name: string;

	@Property()
	public subtype: string;

	@Property()
	public mask: string;

	@ManyToOne(() => SourceEntity)
	public source: SourceEntity;

	@OneToMany(
		() => TransactionEntity,
		(transaction) => transaction.account,
	)
	public transactions = new Collection<TransactionEntity>(this);

	public constructor(
		args?: Partial<
			Pick<
				AccountEntity,
				'id' | 'mask' | 'name' | 'plaidId' | 'source' | 'subtype'
			>
		>,
	) {
		super();
		if (args) Object.assign(this, args);
	}

	public static fromExchangePublicTokenRequestAccount(
		request: ExchangePublicTokenRequestAccount,
	) {
		return new AccountEntity({
			mask: request.mask,
			name: request.name,
			plaidId: request.plaidId,
			subtype: request.subtype,
		});
	}
}
