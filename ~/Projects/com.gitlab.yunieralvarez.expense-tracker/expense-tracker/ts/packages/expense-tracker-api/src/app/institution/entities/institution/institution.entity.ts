import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { InstitutionRepository } from '~/app/institution/repositories/institution/institution.repository';
import { BaseEntity } from '~/app/orm/entities/base/base.entity';
import { PlaidLib } from '~/app/plaid/libs/plaid.lib';

@Entity({
	tableName: InstitutionEntity.metadata.tableName,
	repository: InstitutionEntity.metadata.repositoryFn,
})
export class InstitutionEntity extends BaseEntity {
	public static metadata = {
		repository: InstitutionRepository,
		repositoryFn: () => InstitutionEntity.metadata.repository,
		tableName: 'institution',
	};

	[EntityRepositoryType]? = InstitutionEntity.metadata.repository;

	@Property()
	public plaidId: string;

	@Property()
	public name: string;

	public constructor(plaidId: string, name: string) {
		super();
		this.plaidId = plaidId;
		this.name = name;
	}

	public matchesPlaidInstitution(
		plaidInstitution: PlaidLib.InstitutionsGetByIdResponse,
	) {
		return (
			this.name === plaidInstitution.institution.name &&
			this.plaidId === plaidInstitution.institution.institution_id
		);
	}

	public static fromPlaidGetInstitutionByIdResponse(
		response: PlaidLib.InstitutionsGetByIdResponse,
	) {
		return new InstitutionEntity(
			response.institution.institution_id,
			response.institution.name,
		);
	}
}
