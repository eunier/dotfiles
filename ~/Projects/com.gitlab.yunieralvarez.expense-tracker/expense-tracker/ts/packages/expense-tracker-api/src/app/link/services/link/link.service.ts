import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AccountEntity } from '~/app/account/entities/account/account.entity';
import { InstitutionService } from '~/app/institution/services/institution/institution.service';
import { ExchangePublicTokenRequestDto } from '~/app/link/dto/exchange-public-token-request.dto';
import { LinkTokenDto } from '~/app/link/dto/link-token.dto';
import { PlaidService } from '~/app/plaid/services/plaid/plaid.service';
import { SourceEntity } from '~/app/source/entities/source/source.entity';
import { UserRepository } from '~/app/user/repositories/user/user.repositories';

@Injectable()
export class LinkService {
	private readonly logger = new Logger(LinkService.name);

	public constructor(
		private readonly entityManager: EntityManager,
		private readonly institutionService: InstitutionService,
		private readonly plaidService: PlaidService,
		private readonly userRepository: UserRepository,
	) {}

	/**
	 * Create a Plaid link token.
	 * @param userId The user id.
	 * @returns Plaid link token.
	 */
	public async createLinkToken(userId: string) {
		const response = await this.plaidService.createLinkToken(userId);
		return LinkTokenDto.fromPlaidLinkTokenCreateResponse(response);
	}

	/**
	 * Exchange a Plaid public token for a access token.
	 * @param exchangePublicTokenDto The request dto.
	 * @param userId The user id.
	 */
	public async exchangePublicToken(
		dto: ExchangePublicTokenRequestDto,
		userId: string,
	) {
		const exchangePublicTokenResponse =
			await this.plaidService.exchangePublicToken(dto.publicToken);

		const source = SourceEntity.fromExchangePublicTokenResponse(
			exchangePublicTokenResponse,
		);

		const institution = await this.institutionService.getAndUpsertInstitution(
			dto.institutionId,
		);

		const user = await this.userRepository.findOne({ id: userId });

		if (!user) {
			this.logger.error(`User with id ${userId} not found`);

			throw new NotFoundException(`User with id ${userId} not found`, {
				description: 'The user ID provided does not exist in the database.',
			});
		}

		source.user = user;
		source.institution = institution;

		const accounts = dto.accounts.map(
			AccountEntity.fromExchangePublicTokenRequestAccount,
		);

		for (const account of accounts) {
			account.source = source;
		}

		this.logger.verbose(`Saving ${accounts.length} account(s)`);
		await this.entityManager.persistAndFlush(accounts);
	}
}
