import {
	Collection,
	Entity,
	EntityRepositoryType,
	ManyToOne,
	OneToMany,
	Property,
} from '@mikro-orm/core';
import { TransactionsSyncResponse } from 'plaid';
import { AccountEntity } from '~/app/account/entities/account/account.entity';
import { InstitutionEntity } from '../../../institution/entities/institution/institution.entity';
import { BaseEntity } from '../../../orm/entities/base/base.entity';
import { ExchangePublicTokenResponse } from '../../../plaid/models/exchange-public-token-response/exchange-public-token-response.model';
import { UserEntity } from '../../../user/entities/user/user.entity';
import { SourceRepository } from '../../repositories/source/source.service';

// TOD rename to Item
/**
 * The connection of a institution, account and user.
 *
 * Plaid call this Source a `Item`.
 */
@Entity({
	tableName: SourceEntity.metadata.tableName,
	repository: SourceEntity.metadata.repositoryFn,
})
export class SourceEntity extends BaseEntity {
	public static metadata = {
		repository: SourceRepository,
		repositoryFn: () => SourceEntity.metadata.repository,
		tableName: 'source',
	};

	[EntityRepositoryType]? = SourceEntity.metadata.repository;
	/**
	 * The access token associated with the Source data is being requested for.
	 */
	@Property()
	public accessToken: string;

	/**
	 * The id value of the Item associated with the returned `accessToken`.
	 */
	@Property()
	public plaidId: string;

	/**
	 * A unique identifier for the request, which can be used for troubleshooting.
	 * This identifier, like all Plaid identifiers, is case sensitive.
	 */
	@Property()
	public requestId: string;

	/**
	 * Cursor used for fetching any future transactions updates after the latest update.
	 *
	 * @see {@link TransactionsSyncResponse.next_cursor}
	 */
	@Property({ nullable: true })
	transactionCursor?: string;

	@ManyToOne(() => InstitutionEntity)
	public institution: InstitutionEntity;

	@ManyToOne(() => UserEntity)
	public user: UserEntity;

	@OneToMany(
		() => AccountEntity,
		(account) => account.source,
	)
	public accounts = new Collection<AccountEntity>(this);

	public static fromExchangePublicTokenResponse(
		response: ExchangePublicTokenResponse,
	) {
		const source = new SourceEntity();
		source.accessToken = response.accessToken;
		source.plaidId = response.plaidId;
		source.requestId = response.requestId;
		return source;
	}
}
