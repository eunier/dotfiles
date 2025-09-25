import { faker } from '@faker-js/faker/.';
import { EntityManager } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, MockProxy, mock, mockDeep } from 'jest-mock-extended';
import { InstitutionEntity } from '~/app/institution/entities/institution/institution.entity';
import { InstitutionRepository } from '~/app/institution/repositories/institution/institution.repository';
import { InstitutionService } from '~/app/institution/services/institution/institution.service';
import { PlaidLib } from '~/app/plaid/libs/plaid.lib';
import { PlaidService } from '~/app/plaid/services/plaid/plaid.service';
import { Utils } from '~/app/utils/services/utils/utils.service';

beforeEach(() => {
	jest.useFakeTimers();

	jest.setSystemTime(
		new Date(faker.number.int({ min: 1970, max: 2000 }), 1, 1).getTime(),
	);

	faker.seed(
		Utils.genSeedFromString(
			expect.getState().currentTestName ?? InstitutionService.name,
		),
	);
});

describe('InstitutionService', () => {
	let institutionService: InstitutionService;
	let logger: DeepMockProxy<typeof Logger>;
	let plaidService: MockProxy<PlaidService>;
	let institutionRepository: MockProxy<InstitutionRepository>;
	let entityManager: MockProxy<EntityManager>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				InstitutionService,
				{
					provide: EntityManager,
					useValue: mock(EntityManager),
				},
				{
					provide: InstitutionRepository,
					useValue: mock(InstitutionRepository),
				},
				{
					provide: PlaidService,
					useValue: mock(PlaidService),
				},
			],
		}).compile();

		institutionService = module.get<InstitutionService>(InstitutionService);
		logger = mockDeep(Logger);
		institutionService['logger'] = logger as unknown as Logger;

		plaidService = module.get<PlaidService>(
			PlaidService,
		) as MockProxy<PlaidService>;

		institutionRepository = module.get<InstitutionRepository>(
			InstitutionRepository,
		) as MockProxy<InstitutionRepository>;

		entityManager = module.get<EntityManager>(
			EntityManager,
		) as MockProxy<EntityManager>;
	});

	describe('getAndUpsertInstitution', () => {
		describe('when institution is not in the database', () => {
			it('should log', async () => {
				const plaidId = faker.string.nanoid();

				{
					const resInstitution = mockDeep<PlaidLib.Institution>();
					resInstitution.institution_id = plaidId;
					resInstitution.name = faker.company.name();

					const res = mockDeep<PlaidLib.InstitutionsGetByIdResponse>();
					res.institution = resInstitution;
					plaidService.getInstitutionById.mockResolvedValue(res);
				}

				institutionRepository.findOne.mockResolvedValue(null);
				const loggerSpy = jest.spyOn(logger, 'verbose');
				await institutionService.getAndUpsertInstitution(plaidId);
				const loggerArgs = loggerSpy.mock.calls;
				expect(loggerArgs).toMatchSnapshot();
			});
		});

		describe('when institution is already in the database', () => {
			describe('when institution nodes not match', () => {
				it('should log', async () => {
					const plaidId = faker.string.nanoid();

					{
						const resInstitution = mockDeep<PlaidLib.Institution>();
						resInstitution.institution_id = plaidId;
						resInstitution.name = faker.company.name();

						const res = mockDeep<PlaidLib.InstitutionsGetByIdResponse>();
						res.institution = resInstitution;
						plaidService.getInstitutionById.mockResolvedValue(res);
					}

					{
						const institution = mock<InstitutionEntity>({
							matchesPlaidInstitution:
								InstitutionEntity.prototype.matchesPlaidInstitution,
						});

						institution.id = faker.string.uuid();
						institution.name = faker.company.name();
						institution.plaidId = plaidId;
						institutionRepository.findOne.mockResolvedValue(institution);
					}

					const loggerSpy = jest.spyOn(logger, 'verbose');
					await institutionService.getAndUpsertInstitution(plaidId);
					const loggerArgs = loggerSpy.mock.calls;
					expect(loggerArgs).toMatchSnapshot();
				});
			});
		});
	});
});

describe('InstitutionService (legacy)', () => {
	let institutionService: InstitutionService;
	let plaidService: PlaidService;
	let entityManager: EntityManager;
	let institutionRepository: InstitutionRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				InstitutionService,
				{
					provide: EntityManager,
					useValue: {
						persistAndFlush: jest.fn(),
					} satisfies Partial<EntityManager>,
				},
				{
					provide: InstitutionRepository,
					useValue: {
						findOne: jest.fn(),
					} satisfies Partial<InstitutionRepository>,
				},
				{
					provide: PlaidService,
					useValue: {
						getInstitutionById: jest.fn(),
					} satisfies Partial<PlaidService>,
				},
			],
		}).compile();

		institutionService = module.get<InstitutionService>(InstitutionService);
		plaidService = module.get<PlaidService>(PlaidService);
		entityManager = module.get<EntityManager>(EntityManager);

		institutionRepository = module.get<InstitutionRepository>(
			InstitutionRepository,
		);
	});

	it('should be defined', () => {
		expect(institutionService).toBeDefined();
	});
});
