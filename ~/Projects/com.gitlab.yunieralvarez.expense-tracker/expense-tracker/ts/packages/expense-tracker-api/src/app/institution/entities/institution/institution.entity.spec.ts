import { faker } from '@faker-js/faker/locale/en';
import { InstitutionEntity } from '~/app/institution/entities/institution/institution.entity';
import { PlaidLib } from '~/app/plaid/libs/plaid.lib';
import { Utils } from '~/app/utils/services/utils/utils.service';

beforeEach(() => {
	faker.seed(
		Utils.genSeedFromString(
			expect.getState().currentTestName ?? InstitutionEntity.name,
		),
	);
});

describe('InstitutionEntity', () => {
	it('should be defined', () => {
		expect(
			new InstitutionEntity(faker.string.nanoid(), faker.company.name()),
		).toBeDefined();
	});

	it('should be defined', () => {
		const entity = new InstitutionEntity(
			faker.string.nanoid(),
			faker.company.name(),
		);

		expect(entity.plaidId).toBe('U-TLN43KcN691ftU9_G5J');
		expect(entity.name).toBe('Predovic Inc');
	});

	describe('fromGetInstitutionByIdResponse', () => {
		it('should return an InstitutionEntity', () => {
			const entity = InstitutionEntity.fromPlaidGetInstitutionByIdResponse({
				institution: {
					institution_id: faker.string.nanoid(),
					name: faker.company.name(),
				} satisfies Partial<PlaidLib.Institution> as PlaidLib.Institution,
			} satisfies Partial<PlaidLib.InstitutionsGetByIdResponse> as PlaidLib.InstitutionsGetByIdResponse);

			expect(entity.plaidId).toBe('f__sj4nXVwr0srZQXpr8R');
			expect(entity.name).toBe('Hoppe - West');
		});
	});
});
