import { EntityManager } from '@mikro-orm/postgresql';
import { Provider } from '@nestjs/common';
import { TransactionEntity } from '~/app/transaction/entities/transaction/transaction.entity';
import { TransactionRepository } from '~/app/transaction/repositories/transaction/transaction.repository';

export const TransactionRepositoryProvider: Provider = {
	provide: TransactionRepository,
	useFactory: (em: EntityManager) => em.getRepository(TransactionEntity),
	inject: [EntityManager],
};
