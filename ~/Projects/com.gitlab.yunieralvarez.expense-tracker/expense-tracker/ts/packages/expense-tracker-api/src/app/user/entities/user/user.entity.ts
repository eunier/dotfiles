import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../orm/entities/base/base.entity';
import { UserRepository } from '../../repositories/user/user.repositories';

@Entity({
	tableName: UserEntity.metadata.tableName,
	repository: UserEntity.metadata.repositoryFn,
})
export class UserEntity extends BaseEntity {
	public static metadata = {
		repository: UserRepository,
		repositoryFn: () => UserEntity.metadata.repository,
		tableName: 'user',
	};

	[EntityRepositoryType]? = UserEntity.metadata.repository;
	@Property({ unique: true })
	public email: string;

	@Property()
	public password: string;

	constructor(email?: string, password?: string) {
		super();
		if (email) this.email = email;
		if (password) this.password = password;
	}
}
