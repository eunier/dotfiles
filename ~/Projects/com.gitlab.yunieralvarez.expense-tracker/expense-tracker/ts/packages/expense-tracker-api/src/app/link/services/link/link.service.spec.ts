import { faker } from '@faker-js/faker/.';
import { EntityManager } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountEntity } from '~/app/account/entities/account/account.entity';
import { InstitutionEntity } from '~/app/institution/entities/institution/institution.entity';
import { InstitutionService } from '~/app/institution/services/institution/institution.service';
import { ExchangePublicTokenRequestDto } from '~/app/link/dto/exchange-public-token-request.dto';
import { LinkTokenDto } from '~/app/link/dto/link-token.dto';
import { LinkService } from '~/app/link/services/link/link.service';
import { PlaidLib } from '~/app/plaid/libs/plaid.lib';
import { ExchangePublicTokenResponse } from '~/app/plaid/models/exchange-public-token-response/exchange-public-token-response.model';
import { PlaidService } from '~/app/plaid/services/plaid/plaid.service';
import { UserEntity } from '~/app/user/entities/user/user.entity';
import { UserRepository } from '~/app/user/repositories/user/user.repositories';
import { Utils } from '~/app/utils/services/utils/utils.service';

beforeEach(() => {
	jest.useFakeTimers();
	jest.setSystemTime(new Date(0).getTime());

	faker.seed(
		Utils.genSeedFromString(
			expect.getState().currentTestName ?? LinkService.name,
		),
	);
});

describe('LinkService', () => {
	let linkService: LinkService;
	let plaidService: PlaidService;
	let institutionService: InstitutionService;
	let entityManager: EntityManager;
	let userRepository: UserRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LinkService,
				{
					provide: PlaidService,
					useValue: {
						createLinkToken: jest.fn(),
						exchangePublicToken: jest.fn(),
					} satisfies Partial<PlaidService>,
				},
				{
					provide: UserRepository,
					useValue: { findOne: jest.fn() } satisfies Partial<UserRepository>,
				},
				{
					provide: EntityManager,
					useValue: {
						persistAndFlush: jest.fn(),
					} satisfies Partial<EntityManager>,
				},
				{
					provide: InstitutionService,
					useValue: {
						getAndUpsertInstitution: jest.fn(),
					} satisfies Partial<InstitutionService>,
				},
			],
		}).compile();

		linkService = module.get<LinkService>(LinkService);
		plaidService = module.get<PlaidService>(PlaidService);
		institutionService = module.get<InstitutionService>(InstitutionService);
		entityManager = module.get<EntityManager>(EntityManager);
		userRepository = module.get<UserRepository>(UserRepository);
	});

	it('should be defined', () => {
		expect(linkService).toBeDefined();
	});

	describe('createLinkToken', () => {
		it('should return a link token dto', async () => {
			jest.spyOn(plaidService, 'createLinkToken').mockResolvedValue({
				link_token: faker.string.nanoid(),
			} satisfies Partial<PlaidLib.LinkTokenCreateResponse> as PlaidLib.LinkTokenCreateResponse);

			const res = await linkService.createLinkToken(faker.string.nanoid());

			expect(res).toEqual({
				linkToken: 'z35b6q3t_qj0xpg-bt2uD',
			} satisfies Partial<LinkTokenDto>);
		});
	});

	describe('exchangePublicToken', () => {
		describe('when no user is found', () => {
			it('should throw a not found exception', async () => {
				jest.spyOn(plaidService, 'exchangePublicToken').mockResolvedValue({
					accessToken: faker.string.nanoid(),
					plaidId: faker.string.nanoid(),
					requestId: faker.string.nanoid(),
				} satisfies Partial<ExchangePublicTokenResponse> as ExchangePublicTokenResponse);

				jest
					.spyOn(institutionService, 'getAndUpsertInstitution')
					.mockResolvedValue({
						id: faker.string.nanoid(),
						name: faker.company.name(),
						plaidId: faker.string.nanoid(),
					} satisfies Partial<InstitutionEntity> as InstitutionEntity);

				const entityManagerPersistAndFlushSpy = jest.spyOn(
					entityManager,
					'persistAndFlush',
				);

				const userId = faker.string.nanoid();

				const dto: ExchangePublicTokenRequestDto = {
					publicToken: faker.string.nanoid(),
					institutionId: faker.string.nanoid(),
					accounts: [
						{
							mask: faker.string.numeric(4),
							name: faker.company.name(),
							plaidId: faker.string.nanoid(),
							subtype: faker.string.nanoid(),
						},
						{
							mask: faker.string.numeric(4),
							name: faker.company.name(),
							plaidId: faker.string.nanoid(),
							subtype: faker.string.nanoid(),
						},
					],
				};

				try {
					await linkService.exchangePublicToken(dto, userId);
					fail('Expected NotFoundException to be thrown');
				} catch (err) {
					expect(err).toBeInstanceOf(NotFoundException);

					expect((err as NotFoundException).message).toEqual(
						`User with id ${userId} not found`,
					);
				}
			});
			it('should not call persistAndFlush', async () => {
				jest.spyOn(plaidService, 'exchangePublicToken').mockResolvedValue({
					accessToken: faker.string.nanoid(),
					plaidId: faker.string.nanoid(),
					requestId: faker.string.nanoid(),
				} satisfies Partial<ExchangePublicTokenResponse> as ExchangePublicTokenResponse);

				jest
					.spyOn(institutionService, 'getAndUpsertInstitution')
					.mockResolvedValue({
						id: faker.string.nanoid(),
						name: faker.company.name(),
						plaidId: faker.string.nanoid(),
					} satisfies Partial<InstitutionEntity> as InstitutionEntity);

				const entityManagerPersistAndFlushSpy = jest.spyOn(
					entityManager,
					'persistAndFlush',
				);

				const userId = faker.string.nanoid();

				const dto: ExchangePublicTokenRequestDto = {
					publicToken: faker.string.nanoid(),
					institutionId: faker.string.nanoid(),
					accounts: [
						{
							mask: faker.string.numeric(4),
							name: faker.company.name(),
							plaidId: faker.string.nanoid(),
							subtype: faker.string.nanoid(),
						},
						{
							mask: faker.string.numeric(4),
							name: faker.company.name(),
							plaidId: faker.string.nanoid(),
							subtype: faker.string.nanoid(),
						},
					],
				};

				try {
					await linkService.exchangePublicToken(dto, userId);
					fail('Expected NotFoundException to be thrown');
				} catch (_) {}

				expect(entityManagerPersistAndFlushSpy).not.toHaveBeenCalled();
			});
		});

		describe('when user is found', () => {
			it('it should attached the user to the source', async () => {
				jest.spyOn(plaidService, 'exchangePublicToken').mockResolvedValue({
					accessToken: faker.string.nanoid(),
					plaidId: faker.string.nanoid(),
					requestId: faker.string.nanoid(),
				} satisfies Partial<ExchangePublicTokenResponse> as ExchangePublicTokenResponse);

				jest
					.spyOn(institutionService, 'getAndUpsertInstitution')
					.mockResolvedValue({
						id: faker.string.nanoid(),
						name: faker.company.name(),
						plaidId: faker.string.nanoid(),
					} satisfies Partial<InstitutionEntity> as InstitutionEntity);

				const userId = faker.string.nanoid();

				jest.spyOn(userRepository, 'findOne').mockResolvedValue({
					id: userId,
					email: faker.internet.email(),
					password: faker.string.nanoid(),
				} satisfies Partial<UserEntity> as UserEntity);

				const entityManagerPersistAndFlushSpy = jest.spyOn(
					entityManager,
					'persistAndFlush',
				);

				const dto: ExchangePublicTokenRequestDto = {
					publicToken: faker.string.nanoid(),
					institutionId: faker.string.nanoid(),
					accounts: [
						{
							mask: faker.string.numeric(4),
							name: faker.company.name(),
							plaidId: faker.string.nanoid(),
							subtype: faker.string.nanoid(),
						},
						{
							mask: faker.string.numeric(4),
							name: faker.company.name(),
							plaidId: faker.string.nanoid(),
							subtype: faker.string.nanoid(),
						},
					],
				};

				await linkService.exchangePublicToken(dto, userId);

				const entityManagerPersistAndFlushArgs = entityManagerPersistAndFlushSpy
					.mock.calls[0][0] as AccountEntity[];

				expect(entityManagerPersistAndFlushArgs).toMatchSnapshot();
			});
		});
	});
});
