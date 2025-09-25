import { EntityManager } from '@mikro-orm/postgresql';
import { Provider } from '@nestjs/common';
import { UserEntity } from '~/app/user/entities/user/user.entity';
import { UserRepository } from '~/app/user/repositories/user/user.repositories';

export const UserRepositoryProvider: Provider = {
	provide: UserRepository,
	useFactory: (em: EntityManager) => em.getRepository(UserEntity),
	inject: [EntityManager],
};
