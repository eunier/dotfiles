import { EntityManager } from '@mikro-orm/postgresql';
import { Provider } from '@nestjs/common';
import { SourceEntity } from '~/app/source/entities/source/source.entity';
import { SourceRepository } from '~/app/source/repositories/source/source.service';

export const SourceRepositoryProvider: Provider = {
	provide: SourceRepository,
	useFactory: (em: EntityManager) => em.getRepository(SourceEntity),
	inject: [EntityManager],
};
