import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { InstitutionEntity } from '~/app/institution/entities/institution/institution.entity';
import { InstitutionRepository } from '~/app/institution/repositories/institution/institution.repository';
import { PlaidService } from '~/app/plaid/services/plaid/plaid.service';

@Injectable()
export class InstitutionService {
	private logger = new Logger(InstitutionService.name);

	constructor(
		private readonly entityManager: EntityManager,
		private readonly institutionRepository: InstitutionRepository,
		private readonly plaidService: PlaidService,
	) {}

	/**
	 * Sync plaid institution info with the app's.
	 *
	 * 1. Get institution info from plaid.
	 * 2. If not in the app database, save it, else, do nothing.
	 * @param plaidId The plaid institution id.
	 */
	public async getAndUpsertInstitution(plaidId: string) {
		const response = await this.plaidService.getInstitutionById(plaidId);
		this.logger.verbose(`Fetched institution: ${response.institution.name}`);

		let institution = await this.institutionRepository.findOne({
			plaidId,
		});

		if (!institution) {
			this.logger.verbose(`${response.institution.name} is a new institution`);
			this.logger.verbose(`Saving ${response.institution.name} institution...`);
		} else if (!institution.matchesPlaidInstitution(response)) {
			this.logger.verbose(
				`Institution ${institution.name} plaidId does not match plaid institution`,
			);

			this.logger.verbose(`Updating ${institution.name} institution...`);
		}

		institution =
			InstitutionEntity.fromPlaidGetInstitutionByIdResponse(response);

		await this.entityManager.persistAndFlush(institution);
		return institution;
	}
}
