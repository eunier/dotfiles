import { EntityManager } from '@mikro-orm/postgresql';
import { Provider } from '@nestjs/common';
import { AccountEntity } from '~/app/account/entities/account/account.entity';
import { AccountRepository } from '~/app/account/repositories/account/account.repository';

export const AccountRepositoryProvider: Provider = {
	provide: AccountRepository,
	useFactory: (em: EntityManager) => em.getRepository(AccountEntity),
	inject: [EntityManager],
};
