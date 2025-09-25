import { EntityManager } from '@mikro-orm/postgresql';
import { Provider } from '@nestjs/common';
import { InstitutionEntity } from '~/app/institution/entities/institution/institution.entity';
import { InstitutionRepository } from '~/app/institution/repositories/institution/institution.repository';

export const InstitutionRepositoryProvider: Provider = {
	provide: InstitutionRepository,
	useFactory: (em: EntityManager) => em.getRepository(InstitutionEntity),
	inject: [EntityManager],
};
