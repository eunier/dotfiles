import {
	Entity,
	EntityRepositoryType,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

@Entity({ abstract: true })
export abstract class BaseEntity {
	@PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
	public id: string;

	@Property()
	public createdAt = new Date();

	@Property({ onUpdate: BaseEntity.onUpdateNewDate })
	public updatedAt = new Date();

	public static onUpdateNewDate() {
		return new Date();
	}
}
